#!/bin/bash

(cd frontend && npm run dev) & (cd backend && flask run --port=5001)
