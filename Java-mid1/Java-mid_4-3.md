# 래퍼 클래스

## 래퍼 클래스 - 주요 메서드
```java
public class WrapperUtilsMain {
    public static void main(String[] args) {
        Integer i1 = Integer.valueOf(10);
        Integer i2 = Integer.valueOf("10");
        int intValue = Integer.parseInt("10");

        int compareResult = i1.compareTo(20);
        System.out.println("compareResult = " + compareResult);

        System.out.println(" sum "+ Integer.sum(10,20));
        System.out.println(" max "+ Integer.max(10,20));
        System.out.println(" min "+ Integer.min(10,20));
    }
}
```
- valueOf()` : 래퍼 타입을 반환한다. 숫자, 문자열을 모두 지원한다.
- `parseInt()` : 문자열을 기본형으로 변환한다.
- `compareTo()` :내값과인수로넘어온값을비교한다.내값이크면 `1` ,같으면 `0` ,내값이작으면 `-1` 을 반환한다.
- `Integer.sum()` , `Integer.min()` , `Integer.max()` : `static` 메서드이다. 간단한 덧셈, 작은 값, 큰 값 연산을 수행

**parseInt() vs valueOf()**
- `valueOf("10")` 는 래퍼 타입을 반환한다.
- `parseInt("10")` 는 기본형을 반환한다.

## 래퍼 클래스와 성능
기본형과, 래퍼 클래스의 성능 차이를 비교
```java
public class WrapperVsPrimitive {
    public static void main(String[] args) {
        int iteration = 1_000_000_000;
        long startTime, endTime;

        //기본형 long 사용
        long sumPrimitive = 0;
        startTime = System.currentTimeMillis();
        for (int i = 0; i < iteration; i++) {
            sumPrimitive += i;
        }
        endTime = System.currentTimeMillis();
        System.out.println("sumPrimitive = " + sumPrimitive);
        System.out.println("기본 자료형 long 실행 시간:  " + (endTime - startTime));

        // 래퍼 클래스 Long 사용
        Long sumWrapper = 0L;
        startTime = System.currentTimeMillis();
        for (int i = 0; i < iteration; i++) {
            sumWrapper += i; // 오토 박싱 발생 }
        }
        endTime = System.currentTimeMillis();
        System.out.println("sumWrapper = " + sumWrapper);
        System.out.println("래퍼 클래스 Long 실행 시간: " + (endTime - startTime));
    }
}
```
**실행결과**
```text
sumPrimitive = 499999999500000000
기본 자료형 long 실행 시간:  338
sumWrapper = 499999999500000000
래퍼 클래스 Long 실행 시간: 1485
```
- 기본형 연산이 래퍼 클래스보다 대략 5배 정도 빠르다
- 기본형과 래퍼 클래스의 실행시간이 차이가 나는 이유는 
	- 메모리 사용량 때문이다 
		- 래퍼 클래스는 메타 데이터를 포함하기 때문에 기본형 보다 더 많은 메모리를 차지한다.
- 그러나 기본형 연산이 래퍼 클래스 보다 5배 빠르다고 무조건 기본형을 택하는건 아니다.
- 애플리케이션 관점에서 기본형이든 래퍼 클래스든 1회를 호출한다고 가정했을때는 큰 차이가 없기 때문이다.
	- cpu 연산을 아주 많이 수행하는 특수한 경우에만 최적화를 고려해 볼 수 있다.

>**유지보수 vs 최적화**유지보수 vs 최적화를 고려해야 하는 상황이라면 유지보수하기 좋은 코드를 먼저 고민해야 한다. 특히 최신 컴퓨터는 매 우 빠르기 때문에 메모리 상에서 발생하는 연산을 몇 번 줄인다고해도 실질적인 도움이 되지 않는 경우가 많다. 권장하는 방법은 개발 이후에 성능 테스트를 해보고 정말 문제가 되는 부분을 찾아서 최적화 하는 것이다.


