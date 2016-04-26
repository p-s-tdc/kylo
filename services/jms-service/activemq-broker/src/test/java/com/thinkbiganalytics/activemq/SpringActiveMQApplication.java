/*
 * Copyright (c) 2016.
 */

package com.thinkbiganalytics.activemq;

import org.apache.activemq.command.ActiveMQQueue;
import org.apache.activemq.command.ActiveMQTopic;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jms.annotation.EnableJms;

import javax.jms.Topic;

/**
 * Created by sr186054 on 3/3/16.
 */
@SpringBootApplication
@EnableJms
@ComponentScan(basePackages = {"com.thinkbiganalytics"})
@PropertySource("classpath:activemq.properties")
public class SpringActiveMQApplication  {



    @Bean
    @Qualifier("sampleTopic")
    public Topic topic(){
        ActiveMQTopic topic = new ActiveMQTopic("sample.topic");
        return topic;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringActiveMQApplication.class, args);
    }


}