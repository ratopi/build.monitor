A small web app for monitoring Jobs in build system "Jenkins".

# Deploy

## With GIT

Just clone the source to the Jenkins' tomcat in the root directory:

	cd .../webapp/
	git clone https://github.com/ratopi/build.monitor.git bm

And now call the base URL of you jenkins with final "/bm":

	http://localhost:8080/bm

If your Jenkins runs on a different port, you have to adjust the port ... appenrently.


_Have fun_
