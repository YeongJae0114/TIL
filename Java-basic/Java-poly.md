# 다형성
다형성(Polymorphism)은 이름 그대로 "다양한 형태", "여러 형태"를 를 뜻한다.
프로그래밍에서 다형성은 한 객체가 여러 타입의 객체로 취급될 수 있는 능력


#### 다형성 핵심이론
- **다형적 참조**
- **메서드 오버라이딩**


## 1. 다형적 참조
자바에서 부모 타입은 자신은 물론이고, 자신을 기준으로 모든 자식 타입을 참조할 수 있다. 
이것이 바로 다양한 형태를 참조할 수 있다

```java
Parent parent = new Parent();
Child child = new Child();

Parent poly = new Parent()
Parent poly = new Child()
Parent poly = new Grandson() // `Child` 하위에 손자가 있다면 가능
```
- **다형적 참조의 핵심은 부모는 자식을 품을 수 있다**
- 다형적 참조의 한계
	- Parent poly = new Child()` 이렇게 자식을 참조한 상황
	- Child의 Method는 찾을수 없다
    - 이유 : Parent 타입으로 선언했기 때문에 Parent 클래스에서 필요한 기능을 찾는다. 부모는 자식을 알수 없기 때문에 컴파일 오류발생
    	- 다운 캐스팅을 이용해 해결가능 

### 캐스팅
- 업캐스팅(upcasting): 부모 타입으로 변경 
- 다운캐스팅(downcasting): 자식 타입으로 변경

```text
Child child = (Child) poly 경우 `Parent poly` 라는 부모 타입을 `Child` 라는 자식 타입으로 변경했다. 부모 타입을 자식 타입으로 변경하는 것을 다운캐스팅이라 한다. 반대로 부모 타입으로 변경하는 것은 업캐스팅이라 한다.
```


#### 다운캐스팅
```java
Parent poly = new Child();

Child child = (Child) poly //다운캐스팅을 통해 부모타입을 자식 타입으로 변환한 다음에 대입 시도 Child child = (Child) x001 //참조값을 읽은 다음 자식 타입으로 지정
Child child = x001 //최종 결과
```
##### 다운캐스팅 주의점

```java
public static void main(String[] args) { 
	Parent parent1 = new Child();
	Child child1 = (Child) parent1; child1.childMethod(); //문제 없음
	Parent parent2 = new Parent();
	Child child2 = (Child) parent2; //런타임 오류 - ClassCastException child2.childMethod(); //실행 불가
	} 
}
```

```text
다운캐스팅의 경우 인스턴스에 존재하지 않는 하위 타입으로 캐스팅하는 문제가 발생할 수 있다. 왜냐하면 객체 를 생성하면 부모 타입은 모두 함께 생성되지만 자식 타입은 생성되지 않는다. 따라서 개발자가 이런 문제를 인지하고 사용해야 한다는 의미로 명시적으로 캐스팅을 해주어야 한다.
```

## 2. 다형성과 메서드 오버라이딩
- **오버라이딩 된 메서드가 항상 우선권을 가진다**
```java
public class Parent {
    public String value = "parent";
    public void method() {
	System.out.println("Parent.method");
	} 
}
```

```java
public class Child extends Parent {
    public String value = "child";
    @Override
    public void method() {
        System.out.println("Child.method");
    }
}
```

```java
public class OverridingMain {
    public static void main(String[] args) {
	//자식 변수가 자식 인스턴스 참조
	Child child = new Child(); 
    System.out.println("Child -> Child"); 
    System.out.println("value = " + child.value); 
	child.method();
    
	//부모 변수가 부모 인스턴스 참조
	Parent parent = new Parent();
	System.out.println("Parent -> Parent"); 
    System.out.println("value = " + parent.value); 
    parent.method();
    
    //부모 변수가 자식 인스턴스 참조(다형적 참조)
    Parent poly = new Child();
	System.out.println("Parent -> Child"); 
    System.out.println("value = " + poly.value); //변수는 오버라이딩X 
    poly.method(); //메서드 오버라이딩!

```
*실행화면*
```text
 Child -> Child
 value = child
 Child.method
 Parent -> Parent
 value = parent
 Parent.method
 Parent -> Child
 value = parent
 Child.method
```
*분석*
- poly` 변수는 `Parent` 타입이다. 따라서 `poly.value` , `poly.method()` 를 호출하면 인스턴스의 `Parent` 타입에서 기능을 찾아서 실행한다.
	- `poly.value` : `Parent` 타입에 있는 `value` 값을 읽는다.
	- `poly.method()` : `Parent` 타입에 있는 `method()` 를 실행하려고 한다. 그런데 하위 타입인 `Child.method()` 가 오버라이딩 			되어 있다. **오버라이딩 된 메서드는 항상 우선권**을 가진다. 따라서 `Parent.method()` 가 아니라 `Child.method()` 가 실행된다.

## 3. 다형성이 필요한 이유
- 코드의 중복을 제거하기 위해 : 매번 매개변수의 타입을 정의하며 중복되는 코드 생성
	- 매개변수의 클래스를 정의해야하기 때문에 각자 다른 타입을 정의해줘야 했다.
    	- 상속 관계를 사용해 해결 : 매개변수의 클래스를 상속 
### 다형성을 사용 X 
    
```java
public class AnimalSoundMain {
	public static void main(String[] args) {
        Dog dog = new Dog();
        Cat cat = new Cat();
        Caw caw = new Caw();
        
        soundCaw(Caw);

	} 
	private static void soundCaw(Caw caw) { 
    	System.out.println("동물 소리 테스트 시작"); 
    	caw.sound();
		System.out.println("동물 소리 테스트 종료");
	}
    private static void soundCat(Cat cat) { 
    	System.out.println("동물 소리 테스트 시작"); 
    	cat.sound();
		System.out.println("동물 소리 테스트 종료");
	}
    private static void sounddog(Dog dog) { 
    	System.out.println("동물 소리 테스트 시작"); 
    	dog.sound();
		System.out.println("동물 소리 테스트 종료");
	}
}

```
- `Dog` , `Cat` , `Caw` 의 타입(클래스)이 서로 다르기 때문에 `soundCaw` 메서드를 함께 사용하는 것은 불가능하다.

### 다형성을 사용 

```java
private static void soundAnimal(Animal animal) { 
	System.out.println("동물 소리 테스트 시작"); 
    animal.sound();
	System.out.println("동물 소리 테스트 종료");
}
```


```java
public class AnimalPolyMain3 {
	public static void main(String[] args) {
         Animal[] animalArr = {new Dog(), new Cat(), new Caw()};
         for (Animal animal : animalArr) {
             soundAnimal(animal);
         }
}
	//동물이 추가 되어도 변하지 않는 코드
	private static void soundAnimal(Animal animal) {
		System.out.println("동물 소리 테스트 시작"); 
        animal.sound();
		System.out.println("동물 소리 테스트 종료");
	} 
}
```

## 4. 추상 클래스(abstract)
- 상속 관계를 만들때 부모 클래스는 제공하지만, 실제로 생성돠면 안되는 클래스를 만들기 위해서 추상 클래스 사용
	- 프로그래머가 프로그램에 제약을 건 것
    - 오버라이딩을 쉽게 사용하기 위해서
- 동물( `Animal` )과 같이 부모 클래스는 제공하지만, 실제 생성되면 안되는 클래스를 추상 클래스라 한다.추상 클래스는 이름 그대로 추상적인 개념을 제공하는 클래스이다. 따라서 실체인 인스턴스가 존재하지 않는다. 대신에 상속을 목적으로 사용되고, 부모 클래스 역할을 담당한다
- **추상 메서드가 하나라도 있는 클래스는 추상 클래스로 선언해야 한다.**
- **추상 메서드는 상속 받는 자식 클래스가 반드시 오버라이딩 해서 사용해야 한다.**
- **상속하는 클래스는 모든 메서드를 구현해야 한다.**
- 모든 메서드가 추상 메서드인 **순수 추상 클래스**는 코드를 실행할 바디 부분이 없다
```java
 public abstract class AbstractAnimal {
     public abstract void sound();
     public abstract void move();
}
```
**자세한 사용 방법은 예제를 통해 설명**

## 5. 인터페이스(interface)
- 자바는 순수 추상 클래스를 더 편리하게 사용할 수 있도록 인터페이스라는 개념을 제공한다.
- 상속시 모든 메서드 오버라이딩
- 다중 구현을 지원
	- 다이아몬드 문제가 발생하지 않음

```java
public interface InterfaceA {
     void methodA();
     void methodCommon();
 }
```

```java
public interface InterfaceB {
    void methodB();
    void methodCommon();
}
```

```java
public class Child implements InterfaceA, InterfaceB {
    @Override
    public void methodA() {
        System.out.println("Child.methodA");
}
    @Override
    public void methodB() {
        System.out.println("Child.methodB");
    }
    @Override
    public void methodCommon() {
        System.out.println("Child.methodCommon");
    }
}

```

```java
public class DiamondMain {
    public static void main(String[] args) {
        InterfaceA a = new Child();
        a.methodA();
        a.methodCommon();
        InterfaceB b = new Child();
        b.methodB();
        b.methodCommon();
        }
	}
```
실행결과
```text
 Child.methodA
 Child.methodCommon
 Child.methodB
 Child.methodCommon
```
- `implements InterfaceA, InterfaceB` 와 같이 다중 구현을 할 수 있다. `implements` 키워드 위에 `,` 로 여러 인터페이스를 구분하면 된다.
- `methodCommon()` 의 경우 양쪽 인터페이스에 다 있지만 같은 메서드이므로 구현은 하나만 하면 된다.





        