## JPA 시작
**Member**
```java
package hellojpa;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Member {
    @Id
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```
- @Entity 를 사용하여 Id를 필수로 지정해 줘야함


**JpaMain**
```java
package hellojpa;

import jakarta.persistence.*;

import java.util.List;

public class JpaMain {

    public static void main(String[] args) {

        EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        tx.begin(); // 트랜잭션 시작
        try {
            Member member = new Member();
            member.setId(1L);
            member.setName("Hello");
            em.persist(member); //Member 객체를 영속 상태로 만든 상태, db 저장은 X

//          Member findMember = em.find(Member.class, 1L);
//          findMember.setName("JPA");
            List<Member> result = em.createQuery("select m from Member as m", Member.class)
                    .getResultList();
            for (Member member1 : result) {
                System.out.println("member1 = " + member1.getName());
            }

            tx.commit(); //db에 저장
        }catch (Exception E){
            tx.rollback(); //예외가 발생하면 롤백
        }finally {
            em.close();
        }
        emf.close();
    }
}

```
- EntityManagerFactory는 DB 마다 하나씩 지정
- EntityManager 요청마다 DB에 접근하는데 필요
- EntityTransaction DB안에 모든 변경사항은 트렌잭션을 통해서 관리됨

- tx.commit : 객체를 영속 상태로 만든 상태를 db에 저장
- em.close() : DB 사용이 끝나면 꼭 자원은 반환 해줘야한다. 
- emf.close() : WAS 서버가 끝나면 자원을 반환 