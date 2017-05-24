# NOTES
## ./old
### 기본스펙
* canvas 2D
* "모델 - 월드뷰변환 - 카메라뷰변환 - 투영 - 스크린" 으로 이동하는 과정을 작성
    * 월드뷰변환을 이용해서 모델을 x,y,z축으로 이동시킬수 있어야하고
    * 카메라뷰  : ↑누르면 가까이 다가감,  ↓누르면 뒤로 멀어짐, ← 누르면 좌회전, → 누르면 우회전
    * 스크린은 canvas
* Matrix 를 사용 : 월드뷰 + 카메라뷰 + 투영 매트릭스가 각각 있어야 하고, 최종적으로 3개가 결합되어 1개의 matrix로 만들어져야함
* Matrix 라이브러리 작성
* Perspective Matrix는 OpenGL을 참조함( http://www.songho.ca/opengl/gl_projectionmatrix.html )

### 1차
* 이름 외곽선만 따서 와이어프레임식으로 렌더링

### 2차
* 글자 각각 회전하도록

## propotional
* 비례식으로만 그리기

## firstMat
* s, r, t 매트릭스 도입. cam은 적용하지 않음

## ./new
* scene graph
* oop
* cam mat