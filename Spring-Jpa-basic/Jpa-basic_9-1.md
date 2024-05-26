# 값 타입
## 기본 값 타입
**JPA의 데이터 타입 분류**
- 엔티티 타입
	- @Entity로 정의하는 객체
	- 데이터가 변해도 식별자로 지속해서 추적 가능
	- 예)회원엔티티의키나나이값을변경해도식별자로인식가능
- 값 타입
	- int, Integer, String처럼 단순히 값으로 사용하는 자바 기본 타입이나 객체
	- 식별자가 없고 값만 있으므로 변경시 추적 불가
	- 예) 숫자 100을 200으로 변경하면 완전히 다른 값으로 대체

**값 타입 분류**
- 기본 값 타입
	- 자바 기본 타입(int, double) 
	- 래퍼 클래스(Integer, Long)		
	- String
- 임베디드 타입(embedded type, 복합 값 타입)
- 컬렉션 값 타입(collection v  alue type)

**자바의 기본 타입은 절대 공유X**

**Integer같은 래퍼 클래스나 String 같은 특수한 클래스는 공유 가능한 객체이지만 변경X**

## 임베디드 타입
- 새로운 값 타입을 직접 정의할 수 있음
- JPA는 임베디드 타입(embedded type)이라 함
- 주로 기본 값 타입을 모아서 만들어서 복합 값 타입이라고도 함 
- int, String과 같은 값 타입

<img src="/img/Jpa-basic/jpa9-1_1.png" alt="jpa" width="530" height="280" />

```java
// 임베디드 타입 사용하지 않았을 때
@Entity
public class Member {
  
  @Id @GeneratedValue
  private Long id;
  private String name;
  
  // 근무 기간
  @Temporal(TemporalType.DATE)
  Date startDate;
  @Temporal(TemporalType.DATE)
  Date endDate;
  
  // 집 주소 표현
  private String city;
  private String street;
  private String zipcode;
  // ...
}
```

**임베디드 타입 사용법**
- @Embeddable: 값 타입을 정의하는 곳에 표시
- @Embedded: 값 타입을 사용하는 곳에 표시
- 기본 생성자 필수



```java
// 임베디드 타입 사용
@Entity
public class Member {
  
  @Id @GeneratedVAlue
  private Long id;
  private String name;
  
  @Embedded
  private Period workPeriod;	// 근무 기간
  
  @Embedded
  private Address homeAddress;	// 집 주소
}
```

```java
// 기간 임베디드 타입
@Embeddable
public class Peroid {
  
  @Temporal(TemporalType.DATE)
  Date startDate;
  @Temporal(TemporalType/Date)
  Date endDate;
  // ...
  
  public boolean isWork (Date date) {
    // .. 값 타입을 위한 메서드를 정의할 수 있다
  }
}
```

```java
@Embeddable
public class Address {
  
  @Column(name="city") // 매핑할 컬럼 정의 가능
  private String city;
  private String street;
  private String zipcode;
  // ...
}
```

**임베디드 타입의 장점**
- 재사용- 높은 응집도 
- Period.isWork()처럼 해당 값 타입만 사용하는 의미 있는 메소드를 만들 수 있음
- 임베디드 타입을 포함한 모든 값 타입은, 값 타입을 소유한 엔티 티에 생명주기를 의존함

**임베디드 타입과 테이블 매핑**
- 임베디드 타입은 엔티티의 값일 뿐이다.
- 임베디드 타입을 사용하기 전과 후에 매핑하는 태이블은 같다.
- 객체와 테이블을 아주 세밀하게 매핑하는 것이 가능
- 잘 설계한 ORM 애플리 케이션은 매핑한 테이블의 수보다 클래스의 수가 더 많음

**@AttributeOverride: 속성 재정의**
- 한 엔티티에서 같은 값 타입을 사용하면?
- 컬럼 명이 중복됨
- @AttributeOverrides, @AttributeOverride를 사용

```java
@Entity
public class Member {
  
  @Id @GeneratedValue
  private Long id;
  private String name;
  
  @Embedded
  Address homeAddress;
  
  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name="city", column=@Column(name="COMPANY_CITY")),
    @AttributeOverride(name="street", column=@Column(name="COMPANY_STREET")),
    @AttributeOverride(name="zipcode", column=@Column(name="COMPANY_ZIPCODE"))
  })
  Address companyAddress;
}
```