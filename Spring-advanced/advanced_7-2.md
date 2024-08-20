## 빈 후처리기 - 적용
<img width="944" alt="image" src="https://github.com/user-attachments/assets/2ba5df66-8f71-44eb-8fc3-b07531165dca">

빈 후처리기를 사용해서 실제 객체 대신 프록시를 스프링 빈으로 등록해보자
이렇게 하면 수동으로 등록하는 빈과 컴포넌트 스캔을 사용하는 빈까지 모두 프록시를 적용할 수 있다.

**PackageLogTraceProxyPostProcessor**
```java
package hello.proxy.config.v4_postprocessor.postprocessor;

import ...

@Slf4j
public class PackageLogTraceProxyPostProcessor implements BeanPostProcessor {
    private final String basePackage;
    private final Advisor advisor;

    public PackageLogTraceProxyPostProcessor(String basePackage, Advisor advisor) {
        this.basePackage = basePackage;
        this.advisor = advisor;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        log.info("param beanName={}, bean={}", beanName,bean.getClass());

        // 프록시 적용 대상 여부 체크
        // 프록시 적용 대상이 아니면 원본을 그대로 반환
        String packageName = bean.getClass().getPackageName();
        if (!packageName.startsWith(basePackage)){
            return bean;
        }
        // 프록시 대상이면 프록시를 만들어서 반환
        ProxyFactory proxyFactory = new ProxyFactory(bean);
        proxyFactory.addAdvisor(advisor);

        Object proxy = proxyFactory.getProxy();
        log.info("create proxy : target={}, proxy={}", bean.getClass(), proxy.getClass());
        return proxy;
    }
}
```
- `PackageLogTraceProxyPostProcessor` : 원본 객체를 프록시 객체로 변환하는 역할
- `ProxyFactory` : 외부에서 `advisor` 주입

**BeanPostProcessorConfig**
```java
package hello.proxy.config.v4_postprocessor;

import ...

@Configuration
@Slf4j
@Import({AppV1Config.class, AppV2Config.class})
public class BeanPostProcessorConfig {
    @Bean
    public PackageLogTraceProxyPostProcessor logTraceProxyPostProcessor(LogTrace logTrace){
        return new PackageLogTraceProxyPostProcessor("hello.proxy.app",getAdvisor(logTrace));
    }
    public Advisor getAdvisor(LogTrace logTrace){
        NameMatchMethodPointcut pointcut = new NameMatchMethodPointcut();
        pointcut.setMappedNames("request*", "order*", "save*");
        LogTraceAdvice advice = new LogTraceAdvice(logTrace);

        return new DefaultPointcutAdvisor(pointcut, advice);
    }
}
```
- `@Import({AppV1Config.class, AppV2Config.class})` 수동으로 스프링 빈으로 등록해야한다.
- `logTraceProxyPostProcessor()` : 특정 패키지를 기준으로 프록시를 생성하는 빈 후처리기
  - `hello.proxy.app` : 프록시를 적용할 패키지 정보
  - `getAdvisor(logTrace)` 어드바이저  
   
**ProxyApplication**
```java
package hello.proxy;

import ...

@Import({BeanPostProcessorConfig.class})
@SpringBootApplication(scanBasePackages = "hello.proxy.app") //주의
public class ProxyApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProxyApplication.class, args);
	}

	@Bean
	public LogTrace logTrace(){
		return new ThreadLocalLogTrace();
	}
}
```
- `@Import({BeanPostProcessorConfig.class})` 를 등록
