## 1.클래스의 기초

### 객체지향 프로그래밍?

-   같은/유사한 형식의 반복되는 코드들
-   보다 반복을 줄이고, 체계적이고 안정적이게 이 버튼들을 다룰 방법ex1

```
public class Main {
    public static void main(String[] args) {
        Button btn1 = new Button('1',3,"dark");
        Button btn2 = new Button('2',11,"dark");
        Button btn3 = new Button('3',5,"dark");

        btn1.palce();
    }
}
```

```
public class Button {
    int space;
    char print;
    String mode;

    Button(char print, int space, String mode){
        this.print = print;
        this.space = space;
        this.mode = mode;
    }
    void palce(){
        System.out.printf("%c %s %s %n", print, space, mode);
    }
}
```

-   객체 _object_ / 인스턴스 _instance_ : 속성(프로퍼티)들과 기능(메소드)들의 묶음
    -   자바에서는 객체와 인스턴스를 같은 것으로 이해해도 됨
-   인스턴스는 클래스에서 정의한 방식으로 양산됨

#### ex2

```
public class YalcoChicken {
    int no;
    String name;
    YalcoChicken(int no, String name){
        this.no = no;
        this.name = name;
    }
    String intro(){
        return "hi %d $s".formatted(no,name);
    }

}
```

```
public class Main {
    public static void main(String[] args) {
        YalcoChicken store1 = new YalcoChicken(1, "부여");
        YalcoChicken store2 = new YalcoChicken(2, "대전");
        YalcoChicken store3 = new YalcoChicken(3, "천안");

        store1.intro();
        String[] intros = {store1.intro(), store2.intro(), store3.intro()};

    }
}
```

#### `this` - 만들어질 인스턴스를 가리킴

-   메소드 내에서 같은 이름의 변수나 인자가 없다면 식별자는 `this` 의 필드를 가리킴
-   같은 이름의 변수나 인자가 있다면 덮어씌워짐
    -   필드에는 `this`를 붙여 구분

---

#### ex3

#### 슬라임 클래스

-   생성자를 필요로 하지 않음
-   필드들이 기본 값을 가짐
-   인스턴스를 인자로 받는 메소드

```
public class Slime {
    double hp = 0.5;
    int attack =8;
    double defense = 0.2;

    void attack(Slime enemy){
        enemy.hp -= attack * (1-enemy.defense);
    }
}
```

```
public class Main {
    public static void main(String[] args) {
        Slime slime1 = new Slime();
        Slime slime2 = new Slime();

        slime1.attack(slime2);

    }
}
```

-   객체는 **참조형** - 인자로 전달될 시 내용이 변경될 수 있음
-   같은 클래스의 인스턴스지만, 필드의 값은 각기 별개임 주목

#### ex4

#### 영치킨과 치킨메뉴 클래스

-   클래스의 필드로 다른 클래스의 인스턴스를 담은 배열을 가짐
    -   클래스가 인스턴스가 배열 등 다른 자료형에도, 그 반대로도 포함될 수 있음
-   클래스는 둘 이상의 생성자를 가질 수 있음
-   인스턴스를 반환하는 메소드

```
public class ChickenMenu {
    String name;
    int price;
    String cook = "fly";

    ChickenMenu(String name, int price){
        this.name= name;
        this.price = price;

    }
    ChickenMenu(String name, int price, String cook){
        this.name= name;
        this.price = price;
        this.cook = cook;
    }
}
```

```
public class Main {
    public static void main(String[] args) {
        ChickenMenu[] menus = {
                new ChickenMenu("후라이드", 10000),
                new ChickenMenu("양념치킨", 12000),
                new ChickenMenu("화덕구이", 15000, "bake")
        };
        YeongChicken store1 = new YeongChicken(3,"판교", menus);

        ChickenMenu order1 = store1.orderMenu("양념차킨");
        ChickenMenu order2 = store1.orderMenu("웅차킨");


    }
}
```

```
public class YeongChicken {
    int no;
    String name;
    ChickenMenu[] menus;

    YeongChicken(int no, String name, ChickenMenu[] menus){
        this.no = no;
        this.name = name;
        this.menus = menus;
    }

    ChickenMenu orderMenu(String name){
        for (ChickenMenu menu : menus) {
            if (menu.name.equals(name)) {
                return menu;
            }
        }
        return null;
    }
}
```

#### 주의

-   배열과 같이, 인스턴스도 필드로 들어간 데이터들을 포함하는 주머니
-   메소드에 인자로 들어갈 시, 인스턴스의 **주소값**이 복사되어 들어감
    -   복사된 주소지만 같은 주머니를 가리킨다

---

\## 2.클래스(정적) 필드와 메소스

```
public class YalcoChicken {

    //  ⭐️ 클래스/정적 필드와 메소드들 : 본사의 정보와 기능
    //  인스턴스마다 따로 갖고 있을 필요가 없는 것들에 사용
    static String brand = "얄코치킨";
    static String contact () {
        //  ⚠️ 정적 메소드에서는 인스턴스 프로퍼티 사용 불가
        //  System.out.println(name);

        return "%s입니다. 무엇을 도와드릴까요?".formatted(brand);
    }

    int no;
    String name;

    YalcoChicken(int no, String name) {
        this.no = no;
        this.name = name;
    }

    String intro () {
        //  💡 인스턴스 메소드에서는 정적 프로퍼티 사용 가능
        return "안녕하세요, %s %d호 %s점입니다."
                .formatted(brand, no, name);
    }
}
```

```
//  💡 클래스 필드와 메소드는 인스턴스를 생성하지 않고 사용
        String ycBrand = YalcoChicken.brand;
        String ycContact = YalcoChicken.contact();

        // ⚠️ 인스턴스 메소드는 불가
        //  String ycName = YalcoChicken.name;
        //  String ycIntro = YalcoChicken.intro();

        YalcoChicken store1 = new YalcoChicken(3, "판교");
        String st1Intro = store1.intro();

        //  인스턴스에서는 클래스의 필드와 메소드 사용 가능
        //  ⚠️ 편의상 기능일 뿐, 권장하지 않음 (혼란 초래. IDE에서 자동완성 안 됨 주목)
        String st1Brand = store1.brand;
        String st1Contact = store1.contact();
```

![img](https://file.notion.so/f/f/f5787b06-7575-49c2-8c2c-d197061c3d0f/9c99cb4f-2066-4b93-af09-dd1eede22e3d/_%EB%8C%80%EC%A7%80_27.png?id=3ac7ac59-c3dd-4912-a1ba-9a207ea99c4e&table=block&spaceId=f5787b06-7575-49c2-8c2c-d197061c3d0f&expirationTimestamp=1700992800000&signature=IVCmUwqb1fIP3p8I_Y4D6gsykPOi1k0bgwclRdpVS0U&downloadName=_%EB%8C%80%EC%A7%80+27.png)

-   클래스(정적 _static_) 요소: 메모리 중 한 곳만 차지
-   인스턴스 요소들: 각각이 메모리에 자리를 차지
    -   각각의 자신만의 프로퍼티 값을 가지고 있음

---

## 3.접근 제어자

#### ex1

```
public class SmartPhone {
    String powerButton = "OnOff";
    public String sdCardSlot = "SD Card";
    private String cpu = "Yalcom";
}
```

```
public class Main {
    public static void main(String[] args) {
        SmartPhone phone = new SmartPhone();

        String pb = phone.powerButton;
        String ss = phone.sdCardSlot;
        String cu = phone.cpu; // ⚠️ 불가
    }
}
```

```
//  ⭐️ 다른 패키지에서 사용하면 상단에 임포트되어야 함 (IDE 안내)
    SmartPhone smartPhone = new SmartPhone();

    String pb = smartPhone.powerButton; // ⚠️ 불가
    String ss = smartPhone.sdCardSlot;
```

| 접근 가능 | public | protected | default | private |
| --- | --- | --- | --- | --- |
| 해당 클래스 안에서 | ✅ | ✅ | ✅ | ✅ |
| 동일 패키지 안에서 | ✅ | ✅ | ✅ |   |
| 동일 패키지 또는 자손 클래스 안에서 | ✅ | ✅ |   |   |
| 다른 패키지 포함 어느 곳에서든 | ✅ |   |   |   |

### 클래스의 특정 요소를 감추는 이유

-   ‘감추는’ 것이 아님 - 코드로 확인 가능
    -   라이브러리 예시 확인
    -   폰도 부숴서 확인할 수 있듯이…
-   작성자의 의도대로 사용하도록 하기 위함
    -   쓰라고 의도한 기능만 공개(IDE의 자동완성 등)하여 혼란 방지
        -   내부적으로 수많은 필드들이 사용된다면?
        -   제한이 오히려 편의를 제공
    -   필드에 부적절한 값이 적용되는 등의 오용 방지
    -   다른 클래스와 복합적으로 사용될 경우 혼선 방지
        -   스마트폰 - PC 연결은 USB 케이블로만…
-   기타 다양한 이유

### Getter와 Setter

#### Getter

```
- Getter는 외부에서 객체의 데이터를 읽을 때
```

#### Setter

```
- Setter는 외부에서 객체의 데이터를 접근할 때 
```

#### ex2

```
public class Main {
    public static void main(String[] args) {
        Product ballPen = new Product("볼펜", 1000);

        ballPen.setName("삼색볼펜");
        ballPen.setName("");

        int ballPenPrice = ballPen.getPrice();

        ballPen.setPrice(1500);
    }
}
```

```
public class Product {
    Product(String name, int price){
        this.name = name;
        this.price = price;
    }
    private static double discount = 0.2;
    private static double increaseLimit = 1.2;

    private String name;
    private int price;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name.isBlank()) return;
        this.name = name;
    }

    public int getPrice() {
        return (int) (price * (1 - discount));
    }

    public void setPrice(int price) {
        //  this 사용 주의
        int max = (int) (this.price * increaseLimit);
        this.price = price < max ? price : max;
    }
}
```

---

## 4.상속

### 상속(inheritance)이란

-   기존의 클래스에 기능을 추가하거나 재정의하여 새로운 클래스를 정의하는 것을 의미
    -   부모 클래스의 요소들을 갖고 있음

#### ex1

```
public class YalcoChicken {
    protected int no;
    protected String name;

    public YalcoChicken (int no, String name) {
        this.no = no;
        this.name = name;
    }

    public void takeHallOrder () {
        System.out.printf("%d호 %s점 홀 주문 받음%n", no, name);
    }
}
```

```
public class YalcoChickenDT extends YalcoChicken {
    private boolean driveThruOpen = true;

    public YalcoChickenDT(int no, String name) {
        super(no, name); // 다음 예제에서 다룰 것
    }

    public void setDriveThruOpen(boolean driveThruOpen) {
        this.driveThruOpen = driveThruOpen;
    }

    public void takeDTOrder () {
        System.out.printf(
                "%d호 %s점 드라이브스루 주문 %s%n",
                no, name,
                (driveThruOpen ? "받음" : "불가")
        );
    }
}
```

#### Main.java

```
public class Main {
    public static void main(String[] args) {
        YalcoChickenDT dtStore1 = new YalcoChickenDT(108, "철원");

        dtStore1.takeHallOrder();

        dtStore1.takeDTOrder();
        dtStore1.setDriveThruOpen(false);
        dtStore1.takeDTOrder();
    }
}
```

### 메소드 오버라이딩

-   부모가 가진 같은 이름의 메소드를 자식이 다르게 정의
-   `@Override public void func () { super.func(); // 💡 부모에서 정의한 메소드 호출 this.on = !this.on; System.out.println( "대문자입력: " + (this.on ? "ON" : "OFF") );`
-   오버로딩과 혼동하지 말 것

#### ex2

```
public class Button {
    private String print;

    public Button(String print) {
        this.print = print;
    }

    public void func () {
        System.out.println(print + " 입력 적용");
    }
}
```

```
public class ShutDownButton extends Button {
    public ShutDownButton () {
        super("ShutDown"); // 💡 부모의 생성자 호출
    }

        //  💡 부모의 메소드를 override
        @Override
    public void func () {
        System.out.println("프로그램 종료");
    }
}
```

```
public class ToggleButton extends Button {
    private boolean on;

    public ToggleButton(String print, boolean on) {
        super(print);
        this.on = on;
    }

    @Override
    public void func () {
        super.func(); // 💡 부모에서 정의한 메소드 호출
        this.on = !this.on;
        System.out.println(
                "대문자입력: " + (this.on ? "ON" : "OFF")
        );
    }
}
```

```
public class Main {
    public static void main(String[] args) {
        Button entrButton = new Button("Enter");
        ShutDownButton stdnButton = new ShutDownButton();
        ToggleButton tglButton = new ToggleButton("CapsLock", false);

        entrButton.func();

        System.out.println("\n- - - - -\n");

        stdnButton.func();

        System.out.println("\n- - - - -\n");

        tglButton.func();
        tglButton.func();
        tglButton.func();
        }
    }
```

#### super 부모의 생성자/메소드 호출

-   부모 클래스에 생성자가 작성되었을 시
    -   자식 클래스에도 생성자 작성 필요
    -   `super` 를 사용해서 부모의 생성자를 먼저 호출
        -   자식 클래스의 생성자는 `super` 로 시작해야 함
-   부모의 기타 메소드를 자식 클래스에서 사용시 앞에 `super.` 를 붙임
    -   즉 `super` 는 부모 클래스의 인스턴스(실존하지 않음 - 자신 안의 부모 유전자)를 가리킴
        -   `this` 가 해당 클래스의 인스턴스를 가리키듯
    -   어떤 메소드에서든, 어떤 위치에서든 사용 가능

#### `@Override` 어노테이션

-   어노테이션 : 이후 배울 것
-   부모의 특정 메소드를 오버라이드함을 명시
    -   없어도 오류가 나지는 않음
    -   붙였는데 메소드명이 다를 시 오류 (실수 방지)