#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKEND_DIR="${PROJECT_ROOT}/backend"
readonly FRONTEND_DIR="${PROJECT_ROOT}/frontend"
readonly APP_URL="http://localhost:5173"

open_browser_on_start=true
windows_bash=false

case "${OSTYPE:-}" in
  cygwin* | msys* | win32*) windows_bash=true ;;
esac

if (( $# > 1 )) || [[ "${1:-}" != '' && "${1}" != '--no-browser' ]]; then
  printf 'Usage: bash ./start.sh [--no-browser]\n' >&2
  exit 2
fi

if [[ "${1:-}" == '--no-browser' ]]; then
  open_browser_on_start=false
fi

find_python() {
  local candidate

  for candidate in \
    "${BACKEND_DIR}/.venv/bin/python" \
    "${BACKEND_DIR}/.venv/Scripts/python.exe"; do
    if [[ -x "${candidate}" ]]; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done

  printf 'Backend virtual environment not found. Follow the setup steps in README.md.\n' >&2
  return 1
}

open_browser() {
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -NonInteractive -Command "Start-Process '${APP_URL}'" \
      >/dev/null 2>&1 || return 1
  elif command -v open >/dev/null 2>&1; then
    open "${APP_URL}" >/dev/null 2>&1 || return 1
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "${APP_URL}" >/dev/null 2>&1 || return 1
  else
    return 1
  fi
}

stop_process() {
  local pid="${1:-}"
  local process_row
  local posix_pid
  local parent_pid
  local group_pid
  local windows_pid
  local process_details

  if [[ -z "${pid}" ]] || ! kill -0 "${pid}" 2>/dev/null; then
    return
  fi

  if [[ "${windows_bash}" == true ]] && command -v taskkill.exe >/dev/null 2>&1; then
    process_row="$(ps -p "${pid}" 2>/dev/null | tail -n 1)"
    read -r posix_pid parent_pid group_pid windows_pid process_details <<< "${process_row}"

    if [[ "${posix_pid}" == "${pid}" && "${windows_pid}" =~ ^[0-9]+$ ]]; then
      taskkill.exe //PID "${windows_pid}" //T //F >/dev/null 2>&1 || true
      return
    fi

    printf 'Could not resolve Windows process ID for PID %s.\n' "${pid}" >&2
  else
    kill "${pid}" 2>/dev/null || true
  fi
}

reap_process() {
  local pid="${1:-}"

  if [[ -n "${pid}" ]]; then
    wait "${pid}" 2>/dev/null || true
  fi
}

cleanup() {
  local exit_code=$?

  trap - EXIT INT TERM
  stop_process "${backend_pid:-}"
  stop_process "${frontend_pid:-}"
  reap_process "${backend_pid:-}"
  reap_process "${frontend_pid:-}"
  exit "${exit_code}"
}

wait_for_service_exit() {
  while true; do
    if ! kill -0 "${backend_pid}" 2>/dev/null; then
      wait "${backend_pid}"
      return $?
    fi

    if ! kill -0 "${frontend_pid}" 2>/dev/null; then
      wait "${frontend_pid}"
      return $?
    fi

    sleep 1
  done
}

python_executable="$(find_python)"

if ! command -v npm >/dev/null 2>&1; then
  printf 'npm was not found. Install Node.js 20 or newer and try again.\n' >&2
  exit 1
fi

if [[ ! -d "${FRONTEND_DIR}/node_modules" ]]; then
  printf 'Frontend dependencies are not installed. Run npm install in frontend/.\n' >&2
  exit 1
fi

backend_pid=''
frontend_pid=''
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

(
  cd -- "${BACKEND_DIR}"
  exec "${python_executable}" -m uvicorn app.main:app --reload --port 8000
) &
backend_pid=$!

(
  cd -- "${FRONTEND_DIR}"
  exec npm run dev
) &
frontend_pid=$!

printf 'Backend and frontend are starting. Press Ctrl+C to stop both.\n'
sleep 2

if [[ "${open_browser_on_start}" == true ]] \
  && kill -0 "${backend_pid}" 2>/dev/null \
  && kill -0 "${frontend_pid}" 2>/dev/null; then
  if ! open_browser; then
    printf 'Open %s in your browser.\n' "${APP_URL}"
  fi
fi

set +e
wait_for_service_exit
exit_code=$?
set -e

exit "${exit_code}"
