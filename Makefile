all: install

test: node_modules run_tests

run_tests:
	node_modules/.bin/tap test

node_modules: package.json
	npm install
	touch node_modules

install: packages
	kanso push http://couchdb:5984/mulch # deploy the app

packages: kanso.json
	kanso install
	touch packages

