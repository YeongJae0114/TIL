## 상속

### 상속관계

-   기존 클래스의 필드와 메서드를 새로운 클래스에서 재사용하기 위해 사용
-   속성과 기능을을 물려받음
-   extends 키워드를 통해 상속을 사용
-   대상은 하나만 선택

#### 부모 클래스

-   상속을 통해 자신의 필드와 메서드를 다른 클래스에 제공하는 클래스
-   부모 클래스는 자식 클래스에 접근할 수 없다.

#### 자식 클래스

-   부모 클래스로 부터 필드와 메서드를 상속받는 클래스

### 상속과 메모리 구조

-   상속 관계의 객체를 생성하면 그 내부에는 부모와 자식이 모두 생성
-   상속 관계의 객체를 호출할 때, 대상 타입을 정해야 함 (호출자의 타입을 통해 대상 타입을 찾는다)
-   현재 타입에서 기능을 찾지 못하면 상위 부모 타입으로 기능을 찾아서 실행 (없으면 커파일 오류)

### 상속과 메서드 오버라이딩

-   오버라이딩 : 부모에서 상속받은 기능을 재정의 하는 것
    -   같아야 하는 조건
        -   메서드 이름
        -   메서드 매개변수
        -   반환 타입
        -   접근 제어자
-   생성자는 오버라이딩 불가
-   @Override (이노테이션) : 프로그램이 읽을 수 있는 특별한 주석 , 실수로 오버라이딩을 못하는 경우를 방지

#### 오버로딩 vs 오버라이딩

-   메서드 오버로딩 : 매서드의 이름이 같고 매개변수가 다른 메서드를 여러개 정의하는 것
-   매서드 오버라이딩 : 하위 클래스에서 상위 클래스의 메서드를 재정의하는 것

### super (부모 참조)

-   super 키워드를 사용해 부모를 참조
-   자식과 부모의 필드명이나 메서드가 같을 때 'super.hello()' 와 같이 사용이 가능

#### super 생성자

-   **상속 관계를 사용하면 자식 클래스의 생성자에서 부모 클래스의 생성자를 반드시 호출해야 한다.(규칙)**
-   상속 관계에서 부모의 생성자를 호출할 때는 `super(...)` 를 사용

### 문제와 풀이

-   쇼핑몰의 판매 상품을 만들어보자.
-   `Book` , `Album` , `Movie` 이렇게 3가지 상품을 클래스로 만들어야 한다.
-   코드 중복이 없게 상속 관계를 사용하자. 부모 클래스는 `Item` 이라는 이름을 사용하면 된다.
-   공통 속성: `name` , `price`
    -   `Book` : 저자( `author` ), isbn( `isbn` )
    -   `Album` : 아티스트( `artist` )
    -   `Movie` : 감독( `director` ), 배우( `actor` )

---

Item.java

```
public class Item {
    String name;
    int price;
    public Item(String name, int price){
        this.name= name;
        this.price = price;
    }

    public void print(){
        System.out.println("이름: "+name+" 가격: "+price);
    }
    public int getPrice(){
        return price;
    }

}
```

Book.java

```
public class Book extends Item{
    String author;
    String isbn;

    public Book(String name, int price, String author, String isbn) {
        super(name, price);
        this.author = author;
        this.isbn = isbn;
    }
    @Override
    public void print(){
        super.print();
        System.out.println("저자: "+author+" isbn: "+isbn);
    }
}
```

Album.java

```
public class Album extends Item{
    String artist;
    public Album(String name, int price, String artist){
        super(name,price);
        this.artist = artist;
    }

    @Override
    public void print() {
        super.print();
        System.out.println("아티스트: "+artist);
    }
}
```

Movie.java

```
public class Movie extends Item{
    String director;
    String actor;

    public Movie(String name, int price, String director, String actor){
        super(name, price);
        this.director = director;
        this.actor = actor;
    }
    @Override
    public void print(){
        super.print();
        System.out.println("감독: "+director+" 배우: "+actor);
    }

}
```

ShopMain.java

```
public class ShopMain {
    public static void main(String[] args) {
        Book book = new Book("JAVA", 10000, "han", "12345");
        Album album = new Album("앨범1", 15000,"seo");
        Movie movie = new Movie("영화1", 18000,"감독1", "배우1");

        book.print();
        album.print();
        movie.print();

        int sum = book.getPrice() + album.getPrice() + movie.getPrice();
        System.out.println("상품 가격의 합: " + sum);
    }
}
```