## Object 클래스
자바의 모든 클래스의 최상위 부모 클래스는 항상 `Object` 클래스 이다.
- 클래스에 상속 받을 부모 클래스가 없으면 묵시적으로 `Object` 클래스를 상속
- 명시적으로 extends Object 하지 않아도 자동으로 상속
	- 묵시적으로 Object 클래스를 상속 받는다

**Parent**
```java
package lang.object;

public class Parent {
    public void parentMethod(){
        System.out.println("Parent.parentMethod");
    }
}
```
- 상속 받을 부모 클래스가 없으면 묵시적으로 `Object` 클래스를 상속

**child**
```java
package lang.object;

public class Child extends Parent{
    public void childMethod(){
        System.out.println("Child.childMethod");
    }
}
```
- 상속 받을 부모 클래스가 명시적으로 `extends Parent` 상속

**Main**
```java
package lang.object;

public class Main {
    public static void main(String[] args) {
        Child child = new Child();

        child.childMethod();
        child.parentMethod();

        String string = child.toString();
        System.out.println(string);
    }
}
```
- `toString()` 은 `Object` 클래스의 메서드이다.
- Child의 부모 타입인 Parent의 `Object` 에 `toString()` 이 있으므로 이 메서드를 호출

**출력**
```text
Child.childMethod
Parent.parentMethod
lang.object.Child@452b3a41
```
**자바에서 Object 클래스가 최상위 부모 클래스인 이유**
- 공통 기능 제공
	- 객체에게 필요한 기본 기능을 항상 새로운 메서드를 정의하지 않고 `Object` 는 모든 객체에 필요한 공통 기능을 제공

- 다형성의 기본 구현
	- `Object` 는 모든 클래스의 부모 클래스
	- 다양한 타입의 객체를 통합적으로 처리할 수 있다.
