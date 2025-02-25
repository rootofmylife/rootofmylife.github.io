# How to Create a Low Highlight Text Effect using CSS

```html
<h1><span class="highlight">I love tacos!</span></h1>
```

```css
highlight {
  background: linear-gradient(120deg, #e4a0a1 0%, #e4a0a1 100%);
  background-repeat: no-repeat;
  background-size: 100% 20%;
  background-position: 0 60%;
}
```

## Thicker? No problem! Just increase the _background-size_

```css
highlight {
  background: linear-gradient(120deg, #e4a0a1 0%, #e4a0a1 100%);
  background-repeat: no-repeat;
  background-size: 100% 50%;
  background-position: 0 60%;
}
```

## Thinner? You got it! Decrease the _background-size_

```css
highlight {
  background: linear-gradient(120deg, #e4a0a1 0%, #e4a0a1 100%);
  background-repeat: no-repeat;
  background-size: 100% 5%;
  background-position: 0 60%;
}
```

### What if you want to raise or lower the highlight? All you need to do is adjust the _background-position_. The lower the percentage the “higher” the highlight

```css
highlight {
  background: linear-gradient(120deg, #e4a0a1 0%, #e4a0a1 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  background-position: 0 30%;
}
```

## And the higher the percentage the “lower” the highlight

```css
highlight {
  background: linear-gradient(120deg, #e4a0a1 0%, #e4a0a1 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  background-position: 0 90%;
}
```
