package edu.bsuir.logistic.rest.configuration;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@Profile("local")
@EnableTransactionManagement
@ComponentScan({"edu.bsuir.logistic.rest.configuration"})
@PropertySource(value = {"classpath:application.properties"})
public class HibernateConfigurationLocal {

    @Autowired
    private Environment environment;

    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setPackagesToScan(new String[]{"edu.bsuir.logistic.rest.model"});
        sessionFactory.setHibernateProperties(hibernateProperties());
        return sessionFactory;
    }

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getRequiredProperty("hsqldb.driverClassName"));
        dataSource.setUrl(environment.getRequiredProperty("hsqldb.url"));
        dataSource.setUsername(environment.getRequiredProperty("hsqldb.username"));
        dataSource.setPassword(environment.getRequiredProperty("hsqldb.password"));
        return dataSource;
    }

    private Properties hibernateProperties() {
        Properties properties = new Properties();
        properties.put("hibernate.dialect", environment.getRequiredProperty("hibernate.local.dialect"));
        properties.put("hibernate.show_sql", environment.getRequiredProperty("hibernate.local.show_sql"));
        properties.put("hibernate.format_sql", environment.getRequiredProperty("hibernate.local.format_sql"));
        return properties;
    }

    @Bean
    @Autowired
    public HibernateTransactionManager transactionManager(SessionFactory s) {
        HibernateTransactionManager txManager = new HibernateTransactionManager();
        txManager.setSessionFactory(s);
        return txManager;
    }
}

