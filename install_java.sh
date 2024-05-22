#!/bin/bash

# Descargar e instalar OpenJDK 11
wget https://download.java.net/openjdk/jdk11/ri/openjdk-11+28_linux-x64_bin.tar.gz
tar -xvf openjdk-11+28_linux-x64_bin.tar.gz
mv jdk-11 /opt/jdk-11

# Establecer JAVA_HOME y actualizar PATH
export JAVA_HOME=/opt/jdk-11
export PATH=$JAVA_HOME/bin:$PATH
