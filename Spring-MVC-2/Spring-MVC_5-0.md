## 검증2 - Bean Validation
- 검증 기능을 지금처럼 매번 코드로 작성하는 것은 상당히 번거롭다.
- 이처럼 일반적으로 사용하는 검증 로직를 쉽게 사용할 수 있게 해주는 방법이다.
```java 
 public class Item {
     private Long id;
     @NotBlank
     private String itemName;
     @NotNull
     @Range(min = 1000, max = 1000000)
     private Integer price;
     @NotNull
     @Max(9999)
     private Integer quantity;
  }
```
- 이런 검증 로직을 모든 프로젝트에 적용할 수 있게 공통화하고, 표준화 한 것이 바로 Bean Validation 이다. 
- Bean Validation을 잘 활용하면, 애노테이션 하나로 검증 로직을 매우 편리하게 적용할 수 있다.

**Bean Validation 이란?**
- 검증 애노테이션과 여러 인터페이스의 모음
- 일반적으로 사용하는 구현체는 하이버네이트 Validator 이다.

**하이버네이트 Validator 관련 링크**
- 공식 사이트: http://hibernate.org/validator/
- 공식 메뉴얼: https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/html_single/ 
- 검증 애노테이션 모음: https://docs.jboss.org/hibernate/validator/6.2/reference/en-US/
- html_single/#validator-defineconstraints-spec



