## 자바 메모리 구조

### 자바의 메모리 구조 

1. 메서드 영역
	- 클래스의 정보를 보관
    - 프로그램을 실행하는데 필요한 공통 데이터를 관리
    - 프로그램의 모든 영역에서 공유
2. 스택(stack) 영역
	- 프로그램이 실행되는 영역
    - 메서드를 실행할 때 마다 스택 구조로 쌓인다 
    - 후입 선출(Last In First Out)
3. 힙(heap) 영역
	- 인스턴스가 생성되는 영역 (new 명령어를 사용)
    - 가비지 컬렉션(GC)이 이뤄짐

### 스택영역
```java
public class JavaMemoryMain1 {
  
      public static void main(String[] args) {
         System.out.println("main start");
         method1(10);
         System.out.println("main end");
}
     static void method1(int m1) {
         System.out.println("method1 start");
         int cal = m1 * 2;
         method2(cal);
         System.out.println("method1 end");
}
     static void method2(int m2) {
         System.out.println("method2 start");
         System.out.println("method2 end");
} }
```
실행결과
```bash
 main start
 method1 start
 method2 start
 method2 end
 method1 end
 main end
```
- 자바는 스택 영역을 사용해 매서드 호출과 지역변수를 관리
- 메서드를 게속 호출하면 스택 프레임 게속 쌓임
- 지역변수는 스택 영역에서 관리
- 스택 프레임이 종료되면 지역변수도 함께 제거
- 스택 프레임이 모두 끝나면 프로그램 종료

#### 스택 영역과 힙 영역
- 지역 변수는 스택 영역에 객체는 힙영역에 관리된다.


</br>

---

</br>

## static

### static 키워드를 사용하는 이유
- 메서드 영역에서 관리하는 변수

```java
 public class Data1 {
     public String name;
     public int count;
     public Data1(String name) {
         this.name = name;
         count++;
	} 
}
```

```java
 public class DataCountMain1 {
     public static void main(String[] args) {
         Data1 data1 = new Data1("A");
         System.out.println("A count=" + data1.count);
         Data1 data2 = new Data1("B");
         System.out.println("B count=" + data2.count);
         Data1 data3 = new Data1("C");
         System.out.println("C count=" + data3.count);
     }
}
```
실행결과
```text
A count=1
B count=1
C count=1
```
- 객체를 생성할 때 마다 Data1의 인스턴스는 새로 만들어 지기 때문에 count` 변수도 새로 만들어진다.
- 인스턴스에서 사용되는 멤버 변수 count 값은 인스턴스끼리 공유되지 않는다


### static 사용
**Counter**
```java
 public class Counter {
     public int count;
}
```
**Data2**
```java
public class Data2 {
     public String name;
     public Data2(String name, Counter counter) {
         this.name = name;
         counter.count++;
	} 
}
```
**DataCountMain2**
```java
public class DataCountMain2 {
      public static void main(String[] args) {
         Counter counter = new Counter();
         Data2 data1 = new Data2("A", counter);
         
         System.out.println("A count=" + counter.count);
         Data2 data2 = new Data2("B", counter);
         System.out.println("B count=" + counter.count);
         
         Data2 data3 = new Data2("C", counter);
         System.out.println("C count=" + counter.count);
     }
}
 
```
```text
A count=1
B count=2
C count=3
```
- Counter 인스턴스를 공용으로 사용한 덕분에 객체를 생성할 때 마다 값을 정확하게 증가시킴
- Data2 의 인스턴스가 3개 생성되고, count 값도 인스턴스 숫자와 같은 3으로 출력 

</br>

---

</br>

### static 활용
```java
 public class DataCountMain3 {
     public static void main(String[] args) {
         Data3 data1 = new Data3("A");
         System.out.println("A count=" + Data3.count);
         
         Data3 data2 = new Data3("B");
         System.out.println("B count=" + Data3.count);
         
         Data3 data3 = new Data3("C");
         System.out.println("C count=" + Data3.count);
     }
}
```
- 코드를 보면 count 정적 변수에 접근하는 방법이 조금 특이한데 `Data3.count` 와 같이 클래스명에 `.` (dot)을 사용

### 용어 정리
- 인스턴스 변수 : static이 붙지 않은 멤버 변수
	- 인스턴스를 생성해야 사용이 가능
    - 인스턴스를 새로 생성할 때 마다 새로 만들어진다.
- 클래스 변수(정적 변수, static 변수) : static이 붙은 멤버 변수 
	- 인스턴스를 생성하지 않고 클래스에 접근해서 사용가능
    - 여러곳에 공유하는 목적으로 사용
    - 정적 변수는 거의 프로그램 실행 시점에 딱 만들어지고, 프로그램 종료 시점에 제거된다

### static 메서드
- 정적 메서드는 객체 생성없이 클래스에 있는 메서드를 바로 호출할 수 있다는 장점
- 하지만 정적 메서드는 언제나 사용할 수 있는 것이 아니다.

#### 정적 메서드 사용법
- `static` 메서드는 `static` 만 사용할 수 있다.
	- 클래스 내부의 기능을 사용할 때, 정적 메서드는 `static` 이 붙은 **정적 메서드나 정적 변수만 사용할 수 있 다.**
	- 클래스 내부의 기능을 사용할 때, 정적 메서드는 인스턴스 변수나, 인스턴스 메서드를 사용할 수 없다.
- 반대로 모든 곳에서 `static` 을 호출할 수 있다.
	- 정적 메서드는 공용 기능이다. 따라서 접근 제어자만 허락한다면 클래스를 통해 모든 곳에서 `static` 을 호 출할 수 있다.


### 예제문제
- 문제: 수학 유틸리티 클래스
- 다음 기능을 제공하는 배열용 수학 유틸리티 클래스( `MathArrayUtils` )를 만드세요.
	- `sum(int[] array)` : 배열의 모든 요소를 더하여 합계를 반환합니다. `average(int[] array)` : 배열의 모든 요소의 평균값을 계산 
	- `min(int[] array)` : 배열에서 최소값을 찾습니다.
   	- `max(int[] array)` : 배열에서 최대값을 찾습니다.
    
#### 코드

```java
public class MathArrayUtils {
    private MathArrayUtils(){
    }
    public static int sum(int[] ary){
        int total = ary[0];
        for (int i=1; i < ary.length;i++) {
            total += ary[i];
        }
        return total;
    }
    public static double average(int[] ary){
        return (double) sum(ary) / ary.length;
    }
    public static int min(int[] ary){
        int minValue = ary[0];
        for(int a: ary){
            if(a<minValue){
                minValue = a;
            }
        }
        return minValue;
    }
    public static int max(int[] ary){
        int maxValue = ary[0];
        for(int a: ary){
            if(a>maxValue){
                maxValue = a;
            }
        }
        return maxValue;
    }
}
```

```java
public class MathArrayUtilsMain {
    public static void main(String[] args) {
        int[] values = {1, 2, 3, 4, 5};
        System.out.println("sum=" + MathArrayUtils.sum(values));
        System.out.println("average=" + MathArrayUtils.average(values));
        System.out.println("min=" + MathArrayUtils.min(values));
        System.out.println("max=" + MathArrayUtils.max(values));
    }
}

```
```text
sum=15
average=3.0
min=1
max=5
```

#### 오답노트
```java
public static int sum(int[] values) {
         for (int i=1; i<values.length; i++) {
             values[0] += values[i];
}
         return values[0];
     }
```
- int sum()을 구현할 때 total 변수를 선언하지 않고 values[0]에 더한 값을 넣고 리턴했다
- 이때 values[0]의 값이 아니라 주소(참조값)이 전달되어서 MathArrayUtils 안에서 sum함수를 사용했을 때 주소값이 전달되어 의도하지 않은 값을 반환했다.


## final
`final` 키워드는 이름 그대로 끝! 이라는 뜻
변수에 `final` 키워드가 붙으면 더는 값을 변경할 수 없다

```java
public class Member {
private final String id; //final 키워드 사용 private String name;
     public Member(String id, String name) {
         this.id = id;
         this.name = name;
     }
public void changeData(String id, String name) { //this.id = id; //컴파일 오류 발생
this.name = name;
}
     public void print() {
         System.out.println("id:" + id + ", name:" + name);
	} 
}
```
```java
public class MemberMain {
     public static void main(String[] args) {
         Member member = new Member("myId", "kim");
         member.print();
         member.changeData("myId2","seo");
         member.print();
	} 
}
```
- final 은 변수의 값을 변경하지 못하게 막지만 참조형 변수를 사용할 때에는 참조값을 변경할 수는 없지만 
- 참조값이 가리키는 변수값은 변경이 가능하다.

