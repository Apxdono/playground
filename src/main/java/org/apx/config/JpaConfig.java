package org.apx.config;

import com.jolbox.bonecp.BoneCPDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaDialect;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaDialect;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.persistence.SharedCacheMode;
import javax.sql.DataSource;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;


@Configuration
//@Profile({"test","prod"})
@EnableTransactionManagement
@EnableJpaRepositories("org.apx.beans.domain.repo")
@PropertySource({"classpath:spring/application.properties","classpath:spring/jpa.properties"})
public class JpaConfig {

    @Autowired
    private Environment env;

    @Bean(name = "jpaProperties")
    public Map<String,Object> jpaProperties() {
        Properties p = new Properties();
        try {
            p.load(new ClassPathResource("spring/jpa.properties").getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        Map map = p;
        return new HashMap<String, Object>(map);
    }

    @Bean(name = "dataSource")
    public DataSource dataSource() {
        BoneCPDataSource dataSource = new BoneCPDataSource();
        dataSource.setDriverClass(env.getProperty("db.ds.driver"));
        dataSource.setJdbcUrl(env.getProperty("db.ds.url"));
        dataSource.setUsername(env.getProperty("db.ds.username"));
        dataSource.setPassword(env.getProperty("db.ds.password"));
        return dataSource;
    }

    @Bean(name = "jpaVendorAdapter")
    public JpaVendorAdapter jpaVendorAdapter(){
        EclipseLinkJpaVendorAdapter vendorAdapter = new EclipseLinkJpaVendorAdapter();
        vendorAdapter.setDatabase(Database.valueOf(env.getProperty("db.database")));
        vendorAdapter.setDatabasePlatform(env.getProperty("db.jpa.platform"));
        return vendorAdapter;
    }

    @Bean(name = "jpaDialect")
    public JpaDialect jpaDialect(){
        return new EclipseLinkJpaDialect();
    }

    @Bean(name = "transactionManager")
    public JpaTransactionManager transactionManager(){
        JpaTransactionManager txm = new JpaTransactionManager();
        txm.setJpaDialect(jpaDialect());
        txm.setDataSource(dataSource());
        txm.setEntityManagerFactory(entityManagerFactory());
        return txm;
    }

    @Bean(name = "entityManagerFactory")
    public EntityManagerFactory entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();

        emf.setPersistenceUnitName("emergencyDS");
        emf.setDataSource(dataSource());
        emf.setJpaVendorAdapter(jpaVendorAdapter());
        emf.setJpaDialect(jpaDialect());
        emf.setPackagesToScan("org.apx.domain.model");
        emf.setJpaPropertyMap(jpaProperties());
        emf.setSharedCacheMode(SharedCacheMode.ENABLE_SELECTIVE);
        emf.afterPropertiesSet();
        return emf.getObject();
    }

}