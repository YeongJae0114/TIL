# 래퍼 클래스

## System Class
`System` 클래스는 시스템과 관련된 기본 기능들을 제공
```java
public class SystemMain {
    public static void main(String[] args) {
        // 현재 시간(밀리초)를 가져온다.
        long currentTimeMillis = System.currentTimeMillis();
        System.out.println("currentTimeMillis: " + currentTimeMillis);

        // 현재 시간(나노초)를 가져온다.
        long currentTimeNano = System.nanoTime();
        System.out.println("currentTimeNano: " + currentTimeNano);

        // 환경 변수를 읽는다.
        System.out.println("getenv = " + System.getenv());

        // 시스템 속성을 읽는다.
        System.out.println("properties = " + System.getProperties());
        System.out.println("Java version: " +
                System.getProperty("java.version"));

        // 배열을 고속으로 복사한다.
        char[] originalArray = new char[]{'h', 'e', 'l', 'l', 'o'};
        char[] copiedArray = new char[5];
        System.arraycopy(originalArray, 0, copiedArray, 0,
                originalArray.length);

        // 배열 출력
        System.out.println("copiedArray = " + copiedArray);
        System.out.println("Arrays.toString = " + Arrays.toString(copiedArray));

        //프로그램 종료
        System.exit(0);
    }
}
```

## Math, Random 클래스
`Math` 는 수 많은 수학 문제를 해결해주는 클래스
**Math**
```java
public class MathMain {
    public static void main(String[] args) {
        // 기본 연산 메서드
        System.out.println("max(10, 20): " + Math.max(10, 20)); //최대값
        System.out.println("min(10, 20): " + Math.min(10, 20)); //최소값
        System.out.println("abs(-10): " + Math.abs(-10)); //절대값

        // 반올림 및 정밀도 메서드
        System.out.println("ceil(2.1): " + Math.ceil(2.1)); //올림
        System.out.println("floor(2.7): " + Math.floor(2.7)); //내림
        System.out.println("round(2.5): " + Math.round(2.5)); //반올림

        // 기타 유용한 메서드
        System.out.println("sqrt(4): " + Math.sqrt(4)); //제곱근
        System.out.println("random(): " + Math.random()); //0.0 ~ 1.0 사이의 double 값
    }
}
```

**Random**
랜덤의 경우 `Math.random()` 을 사용해도 되지만 `Random` 클래스를 사용하면 더욱 다양한 랜덤값을 구할 수 있다.
```java
public class RandomMain {
    public static void main(String[] args) {
        Random random = new Random();
        //Random random = new Random(1); //seed가 같으면 Random의 결과가 같다.

        int randomInt = random.nextInt();
        System.out.println("randomInt: " + randomInt);
        double randomDouble = random.nextDouble(); //0.0d ~ 1.0d
        System.out.println("randomDouble: " + randomDouble);
        boolean randomBoolean = random.nextBoolean();
        System.out.println("randomBoolean: " + randomBoolean);

        // 범위 조회
        int randomRange1 = random.nextInt(10); //0 ~ 9까지 출력
        System.out.println("0 ~ 9: " + randomRange1);
        int randomRange2 = random.nextInt(10) + 1; //1 ~ 10까지 출력
        System.out.println("1 ~ 10: " + randomRange2);
    }
}
```


