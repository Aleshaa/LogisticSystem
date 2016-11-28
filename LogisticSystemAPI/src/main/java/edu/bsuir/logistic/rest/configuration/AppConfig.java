package edu.bsuir.logistic.rest.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@Configuration
@EnableScheduling
@EnableWebMvc
@ComponentScan(basePackages = "edu.bsuir.logistic.rest")
public class AppConfig extends WebMvcConfigurerAdapter {

}

