# Object 클래스

## Object와 OCP
`Object` 가 제공하는 `toString()` 이 없다면 각각의 클래스마다 별도의 메서드를 작성해야 한다.

-> Object 없다면 구체적인 클래스에 맞추어 메서드도 계속 늘어난다.

**추상적인 것에 의존**
클래스가 `Object` 클래스를 사용하면 `Object` 에 클래스에 의존한다고 표현한다.
이때 `Object` 객체는 구체적이지 않기 때문에 추상적이라고 한다.

- `Animal` 같은 부모 타입으로 올라갈수록 개념은 더 추상적이게 되고, `Dog` , `Cat` 과 같이 하위 타입으로 내려갈 수록 개념은 더 구체적이게 된다.

**OCP 원칙**
OCP 원칙을 떠올려보자.
- **Open**: 새로운 클래스를 추가하고, `toString()` 을 오버라이딩해서 기능을 확장할 수 있다. 
- **Closed**: 새로운 클래스를 추가해도 `Object` 와 `toString()` 을 사용하는 클라이언트 코드인 `ObjectPrinter` 는 변경하지 않아도 된다.

-> 구체적인 `Car` , `Dog` 에 의존하는 것이 아니라 추상적인 `Object` 에 의존하면서 OCP 원칙을 지킬 수 있다.

**자바 언어는 객체지향 언어 답게 언어 스스로도 객체지향의 특징을 매우 잘 활용**



