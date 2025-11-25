#!/usr/bin/env bash

# This script performs a nightly sync from the source directory to the destination directory using rsync.
# It logs the output to a specified log file and limits the log size to approximately 1MB.

# The source and destination
SRC="/mnt/marble/"
DEST="/mnt/amber/"

# The log file
LOGFILE="$HOME/amber_nightly.log"

# print the current date and time to log file
printf "Sync started at: %s\n" "$(date)" >> "$LOGFILE"

# Use rsync with archive mode and delete files in DEST not in SRC
rsync -av --delete "$SRC" "$DEST" >> "$LOGFILE" 2>&1

# Limit log size to ~1MB (adjust as needed)
LOG_MAX_SIZE=1048576  # 1MB in bytes

if [ -f "$LOGFILE" ]; then
  LOG_SIZE=$(stat --printf="%s" "$LOGFILE")
  if [ "$LOG_SIZE" -gt "$LOG_MAX_SIZE" ]; then
    tail -c "$LOG_MAX_SIZE" "$LOGFILE" > "$LOGFILE.tmp"
    mv "$LOGFILE.tmp" "$LOGFILE"
  fi
fi

# Add a separator for better readability in the log file
printf "\n%s\n" "----------------------------------------" >> "$LOGFILE"
