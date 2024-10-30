## MyBatis 설정/사용

**의존성 추가**
`implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:2.2.0`
- 스프링 부트 3.0 이상
  - `mybatis-spring-boot-starter` 버전을 2.2.0 대신에 3.0.3을 사용


**application.properties 설정**
```text
# MyBatis
mybatis.type-aliases-package=hello.itemservice.domain
mybatis.configuration.map-underscore-to-camel-case=true
logging.level.hello.itemservice.repository.mybatis=trace
```
- 마이바티스에서 타입 정보를 사용할 때는 패키지 이름을 적어주어야 하는데, 여기에 명시하면 패키지 이름 을 생략할 수 있다.
- dbcTemplate의 `BeanPropertyRowMapper` 에서 처럼 언더바를 카멜로 자동 변경해주는 기능
- MyBatis에서 실행되는 쿼리 로그

이제 같은 위치에 실행할 SQL이 있는 XML 매핑 파일을 만들어주면 된다.
참고로 자바 코드가 아니기 때문에 `src/main/resources` 하위에 만들되, 패키지 위치는 맞추어 주어야 한다. 
-> `src/main/resources/hello/itemservice/repository/mybatis/ItemMapper.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.itemservice.repository.mybatis.ItemMapper">

    <insert id="save" useGeneratedKeys="true" keyProperty="id">
        insert into item (item_name, price, quantity)
        values (#{itemName}, #{price}, #{quantity})
    </insert>

    <update id="update">
        update item
        set item_name=#{updateParam.itemName},
            price=#{updateParam.price},
            quantity=#{updateParam.quantity}
        where id=#{id}
    </update>

    <select id="findById" resultType="Item">
        select id, item_name, price, quantity
        from item
        where id = #{id}</select>

    <select id="findAll" resultType="Item">
        select id, item_name, price, quantity
        from item
        <where>
            <if test="itemName != null and itemName != ''">
                and item_name like concat('%',#{itemName},'%')
            </if>
            <if test="maxPrice != null">
                and price &lt;= #{maxPrice}
            </if>
        </where>
    </select>
</mapper>
```
**select - findById**
- Insert SQL은 `<insert>` 를 사용
- `id` 에는 매퍼 인터페이스에 설정한 메서드 이름을 지정하면 된다. 여기서는 메서드 이름이 `save()` 이므로 `save` 로 지정
- 파라미터는 `#{}` 문법을 사용
- useGeneratedKeys` 는 데이터베이스가 키를 생성해 주는 `IDENTITY` 전략일 때 사용

**update - update**
- Update SQL은 `<update>` 를 사용
- 여기서는 파라미터가 `Long id` , `ItemUpdateDto updateParam` 으로 2개이다. 파라미터가 1개만 있으면 `@Param` 을 지정하지 않아도 되지만, 파라미터가 2개 이상이면 `@Param` 으로 이름을 지정해서 파라미터를 구분 해야 한다.

**select - findById**
- Select SQL은 `<select>` 를 사용
- `resultType` 은 반환 타입을 명시하면 된다. 여기서는 결과를 `Item` 객체에 매핑
  - 앞서 `application.properties` 에 `mybatis.type-aliases- package=hello.itemservice.domain` 속성을 지정한 덕분에 모든 패키지 명을 다 적지는 않아도 된다. 
- 자바 코드에서 반환 객체가 하나이면 `Item` , `Optional<Item>` 과 같이 사용하면 되고, 반환 객체가 하나 이상이면 컬렉션을 사용하면 된다. 주로 `List` 를 사용

**select - findAll**
- Mybatis는 `<where>` , `<if>` 같은 동적 쿼리 문법을 통해 편리한 동적 쿼리를 지원
- <if>` 는 해당 조건이 만족하면 구문을 추가
- `<where>` 은 적절하게 `where` 문장을 생성

**XML 특수문자**
>여기에보면 `<=` 를사용하지않고 `&lt;=` 를 사용한것을 확인할 수 있다. 그 이유는 XML에서는 데이터 영역에 `<` , `>` 
같은 특수문자를 사용할 수 없기 때문이다. 이유는 간단한데, XML에서 TAG가 시작하거나 종료할 때 `<` , `>` 와 같은 특수 문자를 사용하기 때문이다.
다른 해결 방안으로는 XML에서 지원하는 `CDATA` 구문 문법을 사용하는 것이다.
이 구문 안에서는 특수문자를 사용할 수 있다. 
대신 이 구문 안에서는 XML TAG가 단순 문자로 인식되기 때문에 `<if>` , `<where>` 등이 적용되지 않는다.

다른 해결 방안으로는 XML에서 지원하는 `CDATA` 구문 문법을 사용

**XML CDATA 사용**

```xml
<select id="findAll" resultType="Item">
  select id, item_name, price, quantity
       from item
       <where>
           <if test="itemName != null and itemName != ''">
               and item_name like concat('%',#{itemName},'%')
           </if>
           <if test="maxPrice != null">
               <![CDATA[
               and price <= #{maxPrice}
               ]]>
           </if>
       </where>
</select>
```
