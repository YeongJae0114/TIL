## 엔티티 매핑

### 객체와 테이블 매핑

- 객체와 테이블 매핑: @Entity, @Table 
- 필드와 컬럼 매핑: @Column
- 기본 키 매핑: @Id
- 연관관계 매핑: @ManyToOne, @JoinColumn

### @Entity- @Entity가 붙은 클래스는 JPA가 관리, 엔티티라 한다. 
- 주의
	- JPA를 사용해서 테이블과 매핑할 클래스는 @Entity 필수
	- 기본 생성자 필수(파라미터가 없는 public 또는 protected 생성자)

### @Table 
- @Table은 엔티티와 매핑할 테이블 지정
- 속성
	- name : 매핑할 테이블 이름 (기본값 엔티티 이름을 사용)
	- catalog : 데이터베이스 catalog 매핑
	- schema : 데이터베이스 schema 매핑
	- uniqueConstraints (DDL) : DDL 생성 시에 유니크 제약 조건 생성

### @Id
- 기본 키 매핑 어노테이션 
- @Id @GeneratedValue(strategy = GenerationType.AUTO) 

### 데이터베이스 스키마 자동 생성 - 주의
- 운영 장비에는 절대 create, create-drop, update 사용하면 안된다.
- 개발 초기 단계는 create 또는 update 
- 테스트 서버는 update 또는 validate
- 스테이징과 운영 서버는 validate 또는 none