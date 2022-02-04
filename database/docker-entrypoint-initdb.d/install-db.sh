#!/bin/sh

cd /usr/src/message-db/database
DATABASE_NAME=dev ./install.sh
DATABASE_NAME=prod ./install.sh
