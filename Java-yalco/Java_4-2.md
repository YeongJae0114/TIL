## 1.다양성
### 상속관계에서

```java
		//  💡 가능 - 자식 클래스는 부모 클래스에 속함
        Button button1 = new Button("Enter");
        Button button2 = new ShutDownButton();
        Button button3 = new ToggleButton("CapsLock", true);

        //  ⚠️ 불가
        ShutDownButton button4 = new Button("Enter");
        ToggleButton button5 = new ShutDownButton();
```
- 자식 클래스의 인스턴스는 부모 클래스 자료형에 속함
    - *모든 셧다운버튼과 토글버튼은 버튼이다.*
- 다른 방향으로는 불가
    - *모든 버튼이 셧다운 버튼이거나 토글버튼인 것은 아니다.*
    - *셧다운 버튼은 토글 버튼이 아니다.*

```java
		//  ⭐️ 편의 : 모두 Button이란 범주로 묶어 배열 등에서 사용 가능
        Button[] buttons = {
                new Button("Space"),
                new ToggleButton("NumLock", false),
                new ShutDownButton()
        };

        for (Button button : buttons) {
						//  ⭐️ 모든 Button들은 func 메소드를 가지므로
            button.func();
				}
```
- 이처럼 특정 자료형의 자리에 여러 종류가 들어올 수 있다(다양성)


### instanceof 연산자

```java
		Button button = new Button("버튼");
        ToggleButton toggleButton = new ToggleButton("토글", true);
        ShutDownButton shutDownButton = new ShutDownButton();

				//  true
        boolean typeCheck1 = button instanceof Button;
        boolean typeCheck2 = toggleButton instanceof Button;
        boolean typeCheck3 = shutDownButton instanceof Button;

        //  false
        boolean typeCheck4 = button instanceof ShutDownButton;
        boolean typeCheck5 = button instanceof ToggleButton;

        //  ⚠️ 컴파일 에러
        boolean typeCheck6 = toggleButton instanceof ShutDownButton;
        boolean typeCheck7 = shutDownButton instanceof ToggleButton;
```
- 뒤에 오는 클래스의 자료에서 속하는 인스턴스인지 확인
- 상속관계가 아니면 컴파일 오류

</br>

---

</br>



## 2.추상 클래스

### final(클래스)
- 함수 내부에서 실수로 변수의 값을 변경하는 것을 방지

#### final 필드
- 값 변경 불가
- 필드 선언시 또는 생성자에서 초기화해야 함
    - 수정이 불가하므로…

#### final 메서드
- 자식 클래스에서 오버라이드 불가

#### final 인스턴스
- 다른 값을 넣는 것은 불가
- 필드는 변경 가능
    - 주소는 바꾸지 못하지만 인테리어는 바꿀 수 있음

#### final 클래스
- 하위 확장 불가 (자식 클래스를 만들 수 없음)

---

### abstract
- 스스로는 인스턴스를 만들 수 없다.
- 자식클래스로 파생되기 위한 클래스

```java
public abstract class YeongGroup {
    protected static  final  String CREED = "우리는 %s 얄팍하다";

    protected final int no;
    protected final String name;

    public YeongGroup(int no, String name){
        this.no = no;
        this.name = name;
    }
    public String intro(){
        return "%d  %s점 입니다.".formatted(no,name);
    }
    public abstract void takeOrder();
}
```
- 클래스 메소드는 abstract 불가
	- 클래스 메소드는 추상 메소드로 작성할 수 없음
    	- 인스턴스를 생성해서 쓰는 것이 아니므로 맞지 않음
- 스스로는 선언만 하고 구현하지 않음
	- 자식 클래스에서는 반드시 구현(안하면 컴파일 에러)
    - 접근제어자 의미 없음(반드시 상속)

```java
public class YeongCafe extends YeongGroup{
    public static String getCreed () {
        return CREED.formatted("원두향은");
    }
    protected static int lastNo = 0;
    public YeongCafe(String name, boolean isTakeout){
        super(++lastNo, name);
        this.isTakeout = isTakeout;
    }
    private boolean isTakeout;

    @Override
    public void takeOrder(){
        System.out.printf("얄코카페 %s 음료를 주문해주세요.%n", super.intro());
        if (!isTakeout) System.out.println("매장에서 드시겠어요?");
    }
}

```

```java
public class YeongChicken extends YeongGroup{
    public static String getCreed(){
        return CREED.formatted("튀김옷은");
    }
    protected static int lastNo = 0;
    public YeongChicken(String name){
        super(++lastNo, name);
    }

    @Override
    public void takeOrder(){
        System.out.printf("얄코치킨 %s 치킨을 주문해주세요.%n", super.intro());
    }
}

```

```java
public class Main {
    public static void main(String[] args) {
        YeongChicken store1 = new YeongChicken("부여");
        YeongChicken store2 = new YeongChicken("대전");

        YeongCafe ycfStore1 = new YeongCafe("울릉", true);
        YeongCafe ycfStore2 = new YeongCafe("강릉", false);

        YeongGroup[] ycStores = {
                store1, store2,
                ycfStore1, ycfStore2
        };

        for( YeongGroup store :ycStores ){
            store.takeOrder();
        }
        System.out.println("\n- - - - -\n");
        System.out.println(YeongChicken.getCreed());
        System.out.println(YeongCafe.getCreed());

    }
}

```
- 그 자체로 인스턴스 생성 불가
    - 얄코그룹에서 매장을 내지는 않음
- 부모 클래스로서는 일반 클래스와 같음
    - 다형성 역시 구현됨


</br>

---

</br>


## 3.인터페이스
### 추상 클래스와의 차이

*🔴  : 추상 클래스 / 🔷  : 인터페이스*

- 🔴  포유류
    - 북극곰 - 🔷  사냥, 🔷  수영
    - 날다람쥐 - 🔷  비행
- 🔴  파충류
    - 거북 - 🔷  수영
    - 날도마뱀 - 🔷  사냥, 🔷  수영, 🔷  비행
- 🔴  조류
    - 독수리 - 🔷  사냥, 🔷  비행
    - 펭귄 - 🔷  사냥, 🔷  수영

|  | 추상 클래스 | 인터페이스 |
| --- | --- | --- |
| 기본 개념 | 물려 받는 것 (혈통/가문/계열) | 장착하는 것 (학위/자격증) |
| 다중 적용 | 불가 (모회사는 하나 뿐) | 가능 (학위는 여럿 딸 수 있음) |
| 상속관계에 의한 제한 | 있음 | 없음 |
| 생성자 | 가짐 | 가지지 않음 |
| 메소드 | 구상, 추상 모두 가능 | 추상 메소드 (abstract 안 붙여도 됨), default 구상 메소드, 클래스 메소드 |
| 필드 | 모두 가능 | 상수만 가능 (final 명시 불필요) |
| 적용 연산자 | extends | implements |


추상 클래스
```java
public abstract class Mamal {
    public boolean hibernation;
    public Mamal(boolean hibernation){
        this.hibernation = hibernation;
    }
}


```
인터페이스
```java
public interface Hunter {
    String position = "포식자"; // ⭐️ final - 초기화하지 않을 시 오류
    void hunt ();
}
```

```java
public interface Swimmer {
    void swim();
}
```

```java
public class PolarBear extends Mamal implements Hunter, Swimmer {
    public  PolarBear(){
        super(false);
    }
    @Override
    public void hunt(){
        System.out.println(position + ": 물범 사냥");
    }

    @Override
    public void swim(){
        System.out.println("앞발로 수영");
    }
}
```
Main
```java
public class Main {
    public static void main(String[] args) {
        //  ⭐ 다형성
        PolarBear polarBear = new PolarBear();
        Mamal mamal = polarBear;
        Swimmer swimmer = polarBear;
        
        polarBear.hunt();
        polarBear.swim();
        }
    }
}

```
- 인터페이스는 다수 적용할 수 있음 확인
- 필드는 `public static final`
    - 명시할 필요 없음
    - 초기화 필수 *(생성자가 없으므로)*
- 메소드는 `public abstract`
    - 명시할 필요 없음
    - 메소드는 적용 클래스에서 구현 필수
- 인터페이스 적용 클래스 작성시 IDE를 사용하면 편함


</br>

---

</br>


## 4.싱글턴

- 프로그램 상에서 특정 인스턴스가 딱 하나만 있어야 할 때
    - 🏪 본사직영매장 하나만 운영하는 회사
    - 프로그램상 여러 곳에서 공유되는 설정
    - 멀티쓰레딩 환경에서 공유되는 리소스
    - 기타 전역으로 공유되는 인스턴스가 필요한 경우
    
### 문제
브라우저 탭을 여러개 열었을 때 사용하고있는 탭의 볼륨을 높일 때 브라우저 탭은 모두 같은 볼륨을 유지해야한다.
이때 공유되는 인스턴스를 만들어 보자

```java
public class Setting {

    //  ⭐️ 이 클래스를 싱글턴으로 만들기

    // 클래스(정적) 필드
    // - 프로그램에서 메모리에 하나만 존재
    private static Setting setting;

    //  ⭐️ 생성자를 private으로!
    // - 외부에서 생성자로 생성하지 못하도록
    private Setting () {}

    //  💡 공유되는 인스턴스를 받아가는 public 클래스 메소드
    public static Setting getInstance() {
        //  ⭐️ 아직 인스턴스가 만들어지지 않았다면 생성
        //  - 프로그램에서 처음 호출시 실행됨
        if (setting == null) {
            setting = new Setting();
        }
        return setting;
    }

    private int volume = 5;

    public int getVolume() {
        return volume;
    }
    public void incVolume() { volume++; }
    public void decVolume() { volume--; }
}
```


```java
public class Tab {
    //  ⭐️ 공유되는 유일한 인스턴스를 받아옴
    private Setting setting = Setting.getInstance();

    public Setting getSetting() {
        return setting;
    }
}
```

```java
		Tab tab1 = new Tab();
        Tab tab2 = new Tab();
        Tab tab3 = new Tab();

        System.out.println(tab1.getSetting().getVolume());
        System.out.println(tab2.getSetting().getVolume());
        System.out.println(tab3.getSetting().getVolume());

        System.out.println("\n- - - - -\n");

        tab1.getSetting().incVolume();
        tab1.getSetting().incVolume();

        System.out.println(tab1.getSetting().getVolume());
        System.out.println(tab2.getSetting().getVolume());
        System.out.println(tab3.getSetting().getVolume());

        //  🎉 외부에서 각 사용처들을 신경쓸 필요 없음
```

