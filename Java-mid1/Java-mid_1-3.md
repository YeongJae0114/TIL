# Object 클래스

## toString
`Object.toString()` 메서드는 객체의 정보를 문자열 형태로 제공한다.
**ToStringMain1**
```java
package lang.object.tostring;
 public class ToStringMain1 {
     public static void main(String[] args) {
         Object object = new Object();
         String string = object.toString();
		  
		  //toString() 반환값 출력 
		  System.out.println(string);
		  //object 직접 출력
          System.out.println(object);
     }
}
```
**출력**
```text
java.lang.Object@a09ee92
java.lang.Object@a09ee92
```
- `System.out.println()` 메서드는 사실 내부에서 `toString()` 을 호출
- `Object` 타입(자식 포함)이 `println()` 에 인수로 전달되면 내부에서 `obj.toString()` 메서드를 호출해서 결과 를 출력


**Object.toString()**
```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

## toString() 오버라이딩
`toString()` 클래스 정보와 참조값을 제공하지만, `toString()` 을 재정의(오버라이딩)해서 보다 유용한 정보를 제공하는 것이 일반적이다.

**Car**
```java
package lang.object.poly.toString;

public class Car {
    private String carName;

    public Car(String carName){
        this.carName = carName;
    }
}
```
- `Car` 는 `toString()` 을 재정의하지 않는다.

**Dog**
```java
package lang.object.poly.toString;

public class Dog {
    private String dogName;
    private int age;

    public Dog(String  dogName, int age){
        this.dogName = dogName;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Dog{" +
                "dogName='" + dogName + '\'' +
                ", age=" + age +
                '}';
    }
}
```
- `Dog` 는 `toString()` 을 재정의했다.

**ObjectPrinter**
```java
package lang.object.poly.toString;

public class ObjectPrinter {
    public static void print(Object object){
        String string = "객체 정보 출력:"+ object.toString();
        System.out.println(string);
    }
}
```
- `toString()` 결과를 합해서 출력하는 단순한 기능

**ToStringMain2**
```java
package lang.object.poly.toString;

public class ToStringMain2 {
    public static void main(String[] args) {
        Car car = new Car("ModelY");
        Dog dog1 = new Dog("멍멍이1", 2);
        Dog dog2 = new Dog("멍멍이2", 5);

        System.out.println("1. 단순 toString 호출");
        System.out.println(car.toString());
        System.out.println(dog1.toString());
        System.out.println(dog2.toString());

        System.out.println("2. println 내부에서 toString 호출");
        //println 내부에서 toString 호출
        System.out.println(car);
        System.out.println(dog1);
        System.out.println(dog2);

        System.out.println("3. Object 다형성 활용");
        ObjectPrinter.print(car);
        ObjectPrinter.print(dog1);
        ObjectPrinter.print(dog2);

        // 참고 - 객체의 참조값 직접 출력
        String refValue = Integer.toHexString(System.identityHashCode(dog1));
        System.out.println("refValue = " + refValue);
    }
}
```
**출력결과**
```
1. 단순 toString 호출 
lang.object.tostring.Car@452b3a41 
Dog{dogName='멍멍이1', age=2} 
Dog{dogName='멍멍이2', age=5}

2. println 내부에서 toString 호출 
lang.object.tostring.Car@452b3a41 
Dog{dogName='멍멍이1', age=2} 
Dog{dogName='멍멍이2', age=5}

3. Object 다형성 활용
객체 정보 출력: lang.object.tostring.Car@452b3a41
객체 정보 출력: Dog{dogName='멍멍이1', age=2}
객체 정보 출력: Dog{dogName='멍멍이2', age=5}
```

**참고 - 객체의 참조값 직접 출력**
`toString()` 은 기본으로 객체의 참조값을 출력한다. 그런데 `toString()` 이나 `hashCode()` 를 재정의하면 객체
의 참조값을 출력할 수 없다. 이때는 다음 코드를 사용하면 객체의 참조값을 출력할 수 있다. 
```java
 String refValue = Integer.toHexString(System.identityHashCode(dog1));
 System.out.println("refValue = " + refValue);
```
