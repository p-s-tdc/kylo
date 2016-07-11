#!/bin/bash

offline=false
working_dir=$2

if [ $# > 1 ]
then
    if [ "$1" = "-o" ] || [ "$1" = "-O" ]
    then
        echo "Working in offline mode"
        offline=true
    fi
fi

if [ $offline = true ]
then
    NIFI_SETUP_DIR=$working_dir/nifi
else
    NIFI_SETUP_DIR=/opt/thinkbig/setup/nifi
fi

echo "Copying the configuration files"
cp $NIFI_SETUP_DIR/logback.xml /opt/nifi/current/conf
cp $NIFI_SETUP_DIR/nifi.properties /opt/nifi/current/conf
cp $NIFI_SETUP_DIR/bootstrap.conf /opt/nifi/current/conf

echo "Installing the thinkbig libraries to the NiFi lib"
mkdir /opt/nifi/current/lib/app
mkdir -p /opt/nifi/data/lib/app
cp $NIFI_SETUP_DIR/*.nar /opt/nifi/data/lib
cp $NIFI_SETUP_DIR/thinkbig-spark-*.jar /opt/nifi/data/lib/app

echo "Creating symbolic links to jar files"
ln -s /opt/nifi/data/lib/thinkbig-nifi-spark-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-spark-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-core-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-core-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-core-service-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-core-service-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-elasticsearch-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-elasticsearch-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-hadoop-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-hadoop-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-hadoop-service-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-hadoop-service-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-provenance-repo-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-provenance-repo-nar.nar
ln -s /opt/nifi/data/lib/thinkbig-nifi-standard-services-nar-*.nar /opt/nifi/current/lib/thinkbig-nifi-standard-services-nar.nar

ln -s /opt/nifi/data/lib/app/thinkbig-spark-interpreter-*-jar-with-dependencies.jar /opt/nifi/current/lib/app/thinkbig-spark-interpreter-jar-with-dependencies.jar
ln -s /opt/nifi/data/lib/app/thinkbig-spark-validate-cleanse-*-jar-with-dependencies.jar /opt/nifi/current/lib/app/thinkbig-spark-validate-cleanse-jar-with-dependencies.jar
ln -s /opt/nifi/data/lib/app/thinkbig-spark-job-profiler-*-jar-with-dependencies.jar /opt/nifi/current/lib/app/thinkbig-spark-job-profiler-jar-with-dependencies.jar

echo "Copy the mysql lib from a lib folder to /opt/nifi/mysql"
mkdir /opt/nifi/mysql

if [ $offline = true ]
then
    cp $NIFI_SETUP_DIR/mysql-connector-java-*.jar /opt/nifi/mysql
else
    cp /opt/thinkbig/thinkbig-services/lib/mysql-connector-java-*.jar /opt/nifi/mysql
fi

echo "setting up temporary database in case JMS goes down"
mkdir /opt/nifi/h2
mkdir /opt/nifi/ext-config
cp $NIFI_SETUP_DIR/config.properties /opt/nifi/ext-config
chown -R nifi:users /opt/nifi

mkdir /var/log/nifi
chown nifi:users /var/log/nifi

echo "Install the nifi service"
cp $NIFI_SETUP_DIR/nifi /etc/init.d
chkconfig nifi on

echo "Starting NiFi service"
service nifi start

echo "Installation Complete"
