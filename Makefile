CC=g++ -std=c++11

all: be gen-cpp/OK gen-nodejs/OK node_modules/OK

gen-cpp/OK: service.thrift
	thrift --gen cpp -r $<
	(cd gen-cpp; for i in `ls *.cpp | grep -v skeleton` ; do g++ -c $$i ; done)
	echo OK >$@

be: be.cc gen-cpp/OK
	${CC} -o $@ $< gen-cpp/*.o -static -lthrift -lgflags -lpthread

node_modules: package.json
	npm install

node_modules/OK: node_modules package.json
	npm update
	echo OK >$@

gen-nodejs/OK: service.thrift
	thrift --gen js:node $<
	echo OK >$@

clean:
	rm -rf gen-cpp gen-nodejs node_modules
