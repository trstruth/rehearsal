#!/bin/bash
set -e

npm --prefix /web run dev &
python /web/app.py
