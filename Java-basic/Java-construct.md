## 1.객체

### 객체란?

-   속성과 기능을 가지는 프로그램 단위

#### 객체 지향 계좌

```
public class Account {
    int balance;

    void deposit(int amount){
        balance += amount;
    }


    void withdraw(int amount){
        if (balance >= amount){
            balance -= amount;
        }else{
            System.out.println("잔액부족");
        }

    }

}
```

```
public class AccountMain {
    public static void main(String[] args) {
        Account account = new Account(); // 객체 생성

        account.balance = 10000;
        account.deposit(1000);
        System.out.println(account.balance);
        account.withdraw(5000);
        System.out.println(account.balance);
        account.withdraw(15000);
        System.out.println(account.balance);
    }
}
```

---

## 2.생성자

**생성자 : 객체 생성 직후 객체를 초기화 하기 위한 특별한 매서드**

```
public class Book {
    String title;
    String author;
    int page;

    public Book(){ 
        this("", "", 0); 
    }
    public Book(String title, String author) {
        this(title,author,20);
    }

    public Book(String title, String author, int page) {
        this.title = title;
        this.author = author;
        this.page = page;
    }
    void displayInfo(){
        System.out.println("제목: " + title + ", 저자: " + author + ", 페이지: " );
    }
}
```

```
public class BookMain {
    public static void main(String[] args) {

        Book book0 = new Book();
        book0.displayInfo();

        Book book1 = new Book("JPA 프로그래밍", "kim", 700);
        book1.displayInfo();

        Book book2 = new Book("JPA 프로그래밍2", "Lee");
        book2.displayInfo();
    }
}
```

### 생성자란?

-   속성과 기능을 한 곳에 두고 데이터를 관리하기 위한 매서드
-   기본 생성자 : 생성자를 만들지 않고 생성자를 호출할 수 있는 기능
    -   매개변수가 없는 생성자
    -   생성자가 하나라도 있지 않다면 자바는 기본생성자를 만들어 준다

### this

-   멤버 변수와 매개 변수의 이름이 같을 때 변수 이름을 구분하기 위해서 사용
    -   블록 안에서 매개변수가 우선순위를 갖기 때문에 멤버변수에 this를 사용한다.
-   this의 생략
    -   멤버변수인지 매개변수인지 찾는 과정에서 매개변수가 아니라면 멤버변수를 찾는다.
    -   this를 사용해도 문제가 없지만, 코드의 가독성을 위해서 this를 생략 해주는것을 지향

### 오버로딩

-   메서드 오버로딩처럼 매개변수만 다르게 해서 여러 생성자를 제공
    -   Book(), Book(String title, String author) 등
-   this() : 생성자의 중복 코드를 줄여준다.
    -   자신의 생성자를 호출한다.