# Object 클래스

## Object 클래스의 다형성
Object는 모든 클래스의 부모 클래스이다. 따라서 모든 객체를 참조할 수 있다.
**Car**
```java
package lang.object.poly;

public class Car {
    public void sound(){
        System.out.println("부르릉");
    }
}
```
**Dog**
```java
package lang.object.poly;

public class Dog {
    public void sound(){
        System.out.println("멍멍");
    }
}
```
**Main**
```java
package lang.object.poly;

public class ObjectPolyExample {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Car car = new Car();

        action(dog);
        action(car);
    }

    private static void action(Object o){
        //obj.sound(); //컴파일 오류, Object는 sound()가 없다.
        // obj.move(); //컴파일 오류, Object는 move()가 없다.

        if (o instanceof Dog dog){
            dog.sound();
        } else if (o instanceof Car car) {
            car.sound();
        }
    }
}
```
- 다형성의 장점
	- Object는 모든 객체의 부모이기 때문에 어떤 객체이든 인자로 전달이 가능하다.

- 다형성의 한계
	-  `obj.sound()` 를 호출하면 오류가 발생
		-  `Object` 에는 `sound()` 메서드가 없기 때문
	- `Object` 가 세상의 모든 메서드를 알고 있지 못한다.
		- 결국 다운캐스팅을 해야한다.

- 결과적으로 다형적 참조는 가능하지만, 메서드 오버라이딩이 안되기 때문에 다형성을 활용하기에는 한계가 있다.

## Object 배열
```java
package lang.object.poly;

import java.util.Arrays;

public class ObjectPolyExample2 {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Car car = new Car();

        Object object = new Object();

        Object[] objects = {dog, car, object};

       size(objects);
    }

    private static void size(Object[] objects) {
        System.out.println("전달된 객체의 수 = " + objects.length);
    }

    private static void action(Object o){
        //obj.sound(); //컴파일 오류, Object는 sound()가 없다.
        // obj.move(); //컴파일 오류, Object는 move()가 없다.

        if (o instanceof Dog dog){
            dog.sound();
        } else if (o instanceof Car car) {
            car.sound();
        }
    }
}
```
- Object를 사용해 모든 객체를 담을 수 있는배열을 만들 수 있다.
- size() 메서드 : 배열에 담긴 객체의 수를 세는 역할
	- 지금 만든 `size()` 메서드는 자바를 사용이 가능하다.


