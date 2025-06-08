# 데이터를 캐싱할 때 사용하는 전략(Cache Aside, Write Around)
## 1. Cache Aside(=Look Aside, Lazy Loading) 전략
- 데이터를 조회 할 때 주로 사용하는 전략이 Cache Aside 전략이다. Look Aside 전략
- 또는 Lasy Loading 전략이라고 부른다. 이 전략은 어떤 식으로 작동하는지 알아보자.

게시판 서비스를 예시로 Cache Aside 작동 방식을 이해해보자.
1. 처음 게시판에는 데이터베이스와 Redis 에는 아무런 데이터가 없다.
2. 일부 사용자가 게시글을 작성한다. 이 데이터는 데이터베이스에만 저장이 된다. (Redis 저장 X)
3. 사용자가 데이터를 조회한다. 이때, 데이터베이스로 부터 바로 데이터를 조회하지 않고 Redis에 데이터가 있는지 확인한다.
4. Redis에 데이터가 없는 걸 확인 한 뒤 데이터베이스로부터 데이터를 조회해서 응답한다.
5. 데이터베이스로부터 조회한 데이터를 응답한 뒤에 Redis 에도 데이터를 저장한다.
6. 다시 한 번 사용자가 데이터를 조회하려고 요청한다.
7. Redis에 조회하고자하는 데이터를 확인하니, 데이터가 존재해서 Redis 로부터 데이터를 바로 가져와 버린다.

**이게 Cache Aside 전략을 적용시킨 형태이다. **

1. 캐시에 데이터가 있을 경우 (= Cache Hit)
![image](https://github.com/user-attachments/assets/2cf3138f-4f5a-459a-9e24-bb324b864dc6)
- 데이터를 요청했을 때 캐시에 데이터가 있는 경우를 Cache Hit

2. 캐시에 데이터가 없을 경우 (= Cache Miss)
![image](https://github.com/user-attachments/assets/cdf5af3d-2a76-41d6-965c-a6c2bda81761)
- 데이터를 요청했을 때 캐시에 데이터가 없는 경우를 Cache Miss
 
### Cache Aside 전략을 정리하면 
> Cache Aside 전략은 캐시(Cache)에서 데이터를 확인하고, 없다면 DB를 통해 조회해오는 방식이다.

##  2. Write Around 전략
- Cache Aside 전략은 캐시에서 데이터를 확인하고, 없다면 어떻게 조회할 지에 대한 전략이었다면, Write Around 전략은 데이터를 어떻게 쓸 지(저장, 삭제, 수정) 에 대한 전략이다.
- Write Around 전략은 Cache Aside 전략과 같이 자주 활용되는 전략이다. Write Around 전략이 어떤 방식인지 ‘저장’의 예시로 알아보자.

![image](https://github.com/user-attachments/assets/594922ad-30a1-4568-b407-b002ca59b9d2)
- 데이터를 저장할 때는 레디스에 저장하지 않고 데이터베이스에만 저장한다.
- 그러다 데이터를 조회할 때 레디스에 데이터가 없으면 데이터베이스로부터 데이터를 조회해와서 레디스에 저장시켜주는 방식

### Write Around를 정리하면 
> Write Around 전략은 쓰기 작업(저장, 수정, 삭제)을 캐시에는 반영하지 않고, DB에만 반영하는 방식이다.
