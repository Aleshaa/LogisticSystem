package edu.bsuir.logistic.rest.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static String REALM = "MY_TEST_REALM";

    @Autowired
    @Qualifier("customUserDetailsService")
    UserDetailsService userDetailsService;

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/rest/**").authenticated()
                .antMatchers("/rest/**/purchase**").hasRole("USER")
                .antMatchers("/rest/get/purchase**").hasAnyRole("USER", "ADMIN")
                .antMatchers("/rest/**/address**").hasAnyRole("ADMIN", "USER")
                .antMatchers("/rest/get/buy**").hasAnyRole("ADMIN", "USER")
                .antMatchers("/rest/create/buy").hasRole("USER")
                .antMatchers("/rest/update/user/**").hasAnyRole("USER", "ADMIN")
                .antMatchers("/rest/get/user/**").hasAnyRole("ADMIN", "USER")
                .antMatchers("/rest/delete/user/**").hasRole("ADMIN")
                .antMatchers("/rest/get/users").hasRole("ADMIN")
                .antMatchers("/rest/**/supplier**").hasRole("ADMIN")
                .antMatchers("/rest/create/supply").hasRole("ADMIN")
                .antMatchers("/rest/get/suppl**").hasRole("ADMIN")
                .antMatchers("/rest/**/goods**").hasRole("ADMIN")
                .and().httpBasic().realmName(REALM).authenticationEntryPoint(getBasicAuthEntryPoint())
                .and().csrf().disable()
                .exceptionHandling()
                .and()
                .authorizeRequests()
                .and()
                .formLogin()
                .failureHandler(new SimpleUrlAuthenticationFailureHandler())
                .and()
                .logout();
    }

    @Bean
    public CustomBasicAuthenticationEntryPoint getBasicAuthEntryPoint() {
        return new CustomBasicAuthenticationEntryPoint();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
}
