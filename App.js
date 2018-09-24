import React from 'react';
import { StyleSheet, Image,Text, TouchableOpacity,TextInput,View,ActivityIndicator } from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import Moment from 'moment';
import { Rating } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
const options = {
  title: 'Select image of your avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
}

export default class App extends React.Component {

  state =  {
    foodName : "",
    resturantAddress : "",
    userReview : "",
    givenRatings : "",
    showImage:false,
    avatar: null,
    fileName:'',
    bgImageSrc : "",
    profileImage : "",
    imageSelect : 0,

  }
  constructor(props){
    super(props);
    this.ratingCompleted = this.ratingCompleted.bind(this);
    this._pickImage = this._pickImage.bind(this);
    // this.onReset = this.onReset.bind(this);

  }
  addBackgroundImage = function(url, canvas) {
    return this.loadImage({
      src: url, x: 0, y: 0,
      width: 300, height: 300,
      canvas: canvas
    });
  }

  addOpaqueBg = (x, y, width, height, ctx) => {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = 1;
  }

  addRatings = (givenRatings, yellowStar, grayStar, canvas) => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const ratingStar = i < givenRatings ? yellowStar : grayStar;
      let x = 32;
      const y = 230;
      const height = width = 10;
      promises.push(this.loadImage({
        src: ratingStar, x: (x + i * width), y: y,
        width: width, height: height,
        canvas: canvas
      }));
    }
    return promises;
  }
  addReviews = async(userReview, ctx) => {
    const reviewLines = userReview.split('\n');
    for (let i = 0; i < reviewLines.length; i++) {
      this.addText(ctx, {
        font: '8px Roboto',
        fill: 'white',
        text: reviewLines[i],
        x: 32, y: (250 + 8 * i),
      });
    }
  }
  getYellowStar(){
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAAHvCAMAAACCO00pAAAC61BMVEUAAAD//wD//wD//wD/vwD/zAD/1QD/2wD/vwD/xgD/zAD/0QD/vwD/xAD/zAD/wwD/xg7/vw3/wgz/xQz/yAv/ygv/wgr/xAr/xgn/yAn/wQn/xAn/xQj/xwj/wQj/wwj/xQf/wQ7/ww3/xA3/xg3/wQz/wgz/xAz/xQz/xgv/wgv/wwv/xQv/xgr/wgr/wwr/xAr/xQr/wg7/ww7/xA7/xQ3/wQ3/wg3/xA3/xA3/wQz/wgz/wwz/xAz/xQz/wgv/wwv/xAv/xQv/wgv/wwv/xA7/xA7/wg7/ww3/ww3/xA3/wg3/wg3/ww3/xAz/wgz/wgz8wwz8xAz8xAz8wgz8wwv8wwv8xA78wg78ww78ww78xA38wg38ww38ww38xA38wg38wg39ww39xAz9wgz9wgz9wwz9wwz9xAz9wg79ww79ww79xA79wg79ww39ww39xA39wg39wg39ww39xA39wg39wg39wwz9wwz9wgz9wgz9ww79ww79xA79wg79ww79ww79xA39wg39ww39ww39ww39wg39wg39ww39ww39wg39wgz9wwz9wwz9wg79wg79ww79ww79ww79wg79ww39ww39ww39wg39ww39ww39ww39wg39wg39ww39ww39wg39wg79ww79ww79wg79ww78ww78ww38wg38ww38ww38ww38wg38wg38ww38ww38wg38wg38ww78ww78wg78wg78ww78ww78wg78wg38ww38ww38ww38wg38ww38ww38ww38wg38wg38ww38ww38wg78wg79ww79wg79wg79ww79ww39wg39wg39ww39ww39ww39wg39ww39ww39ww39wg39wg79ww79ww79wg79wg79ww79ww79wg79wg39ww39ww39wg39wg39ww39ww39ww39wg39wg39ww79ww79wg79wg79ww79wg79wg79ww79ww39wg39wg39ww39ww39wg39wg39ww39ww39ww5Bx+CuAAAA+HRSTlMAAQIDBAUGBwgJCgsMDQ8REhQVFhcYGRobHB0eHyAhIiMlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6mqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8vP09fb3+Pn6+/z9/ovNoJEAABBJSURBVHgB7d3/m1Tlfcbxe3ZxYWOWbGzWUiFWtMQQUJREQgQrgaCBkgY1IVFjVEBRCCKGgIpQBL+DEEAQgzWiBBolKglFKRUJBUIAKRVrFa11rWaVFZZdmJ37x15JNXyZnd0zc+acM8/nuV//wl7Xnh/meX9ueG306g+33PkXEB8Nfot/dPAf4B8Z0MSPzYFvpCePuAnil9ROHtF4Crwio3m01fCJnLiPx/gGPCKX8FiPwyPyJI9VXw5vSEUD6e1/f/kmj7cY3pClPF5dCp6Q8npmOR+ekAuZbQ48IQuYrRZ+kFQtW3AOvCBfZUtmwgtyP1uyB16QvWzRF+ABOZstuxXigRls2TaIB/Ywhy4wT7oxl5tgnkxhLi/BPNnGXDLVME66MLfRME4mMLd/hnGykbmlq2Ca1GTYiitgmlzP1jwN0+R5tqapEoZJdZqtGg7D5Cq27gkYJs+ydfUVMEsqm9iGi2CWfIdtWQKzZAWzKffwN+3L1h9GyTC2bS6MksfYtlr4Q2lftt4wSQYxiLtgkixiEHthkaTqGEh3GCTnM5ipMEjmMJgdMEhqGVAXmCPnMqiJMEfuYlCbYI7sZWA1MEa6M7gxMEamMrgXYIzsYHDpapgiXZiPq2CK3MJ8PANTZDOzKPfwRg3zcxkMkRuZn+UwRNYzPw0VMEOqM8zTEJgh1zJfS2GG/JoBaNvJqKo083YhjJDvM3/zYYT8kvmrTcEEqWxgAc6DCfJtFuJemCBPsBB7YYFU1LMgPWCAXMTCTIMB8ggL8zLcJ+V1LFAXOE/+loX6MZwnP2WhNsMeLbYq9/DIeSzcjXCc3MvC/QvsU9qnbSezejKMq+E0mc4wnoPT5N8ZRlMVHCanM5wRcJhMZjgr4TDZymzKPZR1BzUMzpLxDOsxOEs2MJtyD6V9wQ2Eo2Q0w3sIjpK1zIe2nZT2ZesLJ8mVLIYH4CT5FbMo99Bia57OhoPkMhbHDDhIlrM4dkNsLrYGczqcI0NZLJPhHHmUxbIVYnOx1WjuIV9n8fwIjpGFLJ4XITYXW03mHtKXxTQSTpHZLKbfwClSy2JKV8Ehcg6L6/twiMxkcf0SDpE9LK6GSjhDzmSx/T2cIbex2B6HM2Q7syj3UNoXwjfgCLmZxbcYjpBNzKbcQ4utYZwPJ8gNjMKDcIKsYxRq4QKpTjMS58IBcjWjMQsOkOeYzZfYT6qaGJEzUfJkBKNyG0qerGRUfg+xsNhqdttJvsXoTECJk8cZnY0Qb9K+bJkalDQZzChdh5ImDzNKayE20z4DuYf0Z7SuRAmTuYzWKpQwqWW0mipRsuTLjNolKFlyN6P2JMTAYqu9bSf5EqN3MUqUTGP0HkGJkpcZvbpyiDdpX7YLUJJkEuMwDyVJtjAU5R5K+wL4MkqQjGM87kYJkhcZhnIPLbYG0x0lR0YyLlNRcmQN47IDYmex1UDuIVcwPhNRYuRpxmcTxMBiq5VtJ7mEcboBJUWeZJzWQWwutgaSrkYJkW8yXj9ECZGfMV7PQixk3QZyD7mQcfsOSoYsYNx+gVIhqVpm8yX3kD6M31BIibif8XsU1intc2DbSc5mEgZASsIMJmEBpCTsYRJqU5AS0I3J6AMpAVOYjPsgJWAbsyj3UNYduZ5InExgUqYjcbKRSdmFpElNhqEo9+jX32GzmJwfw31dt1E8lJnTAcB59RQ/7eqEk/dTfPVfmEfxF3ZR/IUPKP7C6xR/YSXFX/gexV/AGxRf/QEYRPHVKADzKH7aAgAnbKX46P2/wh+d8g7FQ+fi/53+B4pvDvTDJ874b4pf6nriiJNfpvhk72k4WtVaij9eqcFxllB8sbEjsoxqpHhhWXu04Ky3aZ8cvAYtq15L6+TN7sgldUczTZO1HdGKAftolzTflkKrOm+jVVLXD22pWESbZFsnBDCikQbJggoE0v11WiMNwxFU1WraIq93Qx4mpWmIrKpCXvq9RyskPRH5qtlMG+S9PshfuwdpgWysQUGG76fz5IFyFKjrq3Sb7B+Kwp24ii6T3V0RyvjDdJasqERIvWvpJjl0I8I7aSNdJLW9UQzl99A9sv4kFMngerpFMjPLUDSn7qZLpH4wiqlyBd0hO09FkV3XRJfoIX8IDmcA0ngtolC9nlL63jwL0SibnqEL9JA/BIczAGm+PYUIdd5JKV11AxCt9g/TAXrIH4KbGYAsrEAMur9JKT0NIxCPjqvpNj3kD2dyM6WkrK5CjPrVUUpH+hbEq9NmOk0P+cNpN49SGjbXIAHDGyglYHY7JKLbq3SMHvJncTkDkFe7IkETDjNBsuJEJKpPLZMih8YiHGUAesgfTvl9dJse8ocztJ5xk8ysMoSnDEAP+ZUB6CF/OGOa6DQ95A+n99uMhzSORLEpA9BD/nDKZmToND3kD2fwPkZLmqemEBFlAHrIH077ZXSbHvKHc/VBRkQeqkAoDmcA0jgCLui4lsUnr3eHG1K3NtMBesjvSAYg6UlwSadtLB55rx/cUjGfbtNDfmUApWFOOzio2+uU8PYPh5uqVtFtesgfzsQ0JZRVJ8Jhfd5j4eTQj+C2mo10mh7yh1P+AAsjG0+CAUP3swBydzlM6LqbcdNDfpczANl9Kgy58RDzIMsq4TTtwYXQNBrWnLSeEszbZ8GespkZSgBrq2GS9uACyExLwahTd1Jat28AbFIGEMC2zjDt2kZKTosrYNxZb9JZesivDEAP+cNJ3d7MAPSQ36oBdZRjpX8CVygD0EP+cCoWUrIf8vtjRAM/JnPbwTHKAPSQP5yq1ZTsh/z++HGa1EN++EoZwOHx8FnNZj3k91m7OXrI7yVlAPeUA9L1Vfqofigkew9OD/m9M+4QPbOiEuJrBtB0HSR7D04P+X1VfleGnlhfDfE1A8hML4NB2oPTQ/5wKpfRup2dITmNaqRpD7eHtOKst/WQ32fVa2nVm93RFklNy9Ck1R0hAQzYR3uaJ0OC6byN1tT1gwRVsZi2bO4ECe5U2tIReZCJtGU48iCbaMsTkOBqaEx9BSSwMbTmIkhgL9CaJZCgqtO0pi4FCegq2tMfEtAztGcuJJjKJtpTCwnmMlrUGxLIclp0NySIigZatBcSxBDa1B0SwKO0aSraJuX1tGkH2iYDaFUXtEkW0KqJaIukamnVJrRF+tCuGrRB7qNdY9AG2Uu7XoC0ricNS1dDWjWdll0FadUuWvYMpDVdaFpTJaQVk2jbZZBWbKFtyyG51dC4hgpITuNo3RBITv9K65ZCcqnO0Lr6ckgO19K+AZAcfk37FkBaVpWmfbUpSIu+Rx/0gbTon+iD+yAtqWygD/ZCWvIt+qEnpAU/px+mwx/KO7LsgmQbRF90gWRZRF9MghwvVUdfbIEc73z6owZynDn0x1jIcWrpj/WQY51Dj2SqIceYSZ9cAznGHvpkNeRoX6BXmqogR7mVfhkBOco2+mUljpAu9ExDJeTPbqJvvgX5s5fom59DPlGToTeUe2S5jv4ZBPnYWvpnEcJS3qFtJwOupI++BvmTVfTRbISj5SZtOxlwCf3UCwLgSfrpTghQ0UA/7YEAF9NX3SB4hL6aAimvo69+B7mA/lLsh3n013h4r5b+2gDffYUeU+5xD302SstNPlsDv32JXktXwWt30G9XwGs76ben4bO/ZsJ+wYSdCI/dwkS91QsDP2CihsNj/8YkPdsRwMmbmKQntNyUjKZx+JPyGc1MTn0FvHUDk/NGD3zigveZnIvgrXVMzFOfxhGf28DELIGvqtNMyMHROEbZ1GblHnG7mgl57Uwcr++7TEh/eOo5JmP5p5Dts+uYjLnwU1UTk3Dgh2hRanJauUeMvsskvHIGcvnKO0xCb3hpBRPwSAfk9pk1TMBdyjticuBStG7iYW07xePvGLtdp6Etvd5i7L4ID/0j47agPdrW8VnG7XYtN0Xvo2EIZlwT47Ud/vk647X98wiqxxvKPaK2kLGafQKC+/RTjNXNWm6K1L6LkZ/rGxmjTfDNVxmjracgX2e+oW2nCN3P2GTubodsJfUBGKO8IyrvD0Rhrm1gXF6AX85mXDZ8DoU68zXGJF0Nr8xgPJqnl6Fwn1rOmFwFr+xmLN7ti3B+cICxeAY+OZ2xWPdZhHXGK4xDUyU8MpkxSE9JIbwOSxiHy+CRrYzeO19BcVx6gNFbrryjqNZ8BsVy2i5GrqEC3vgRo3boZhRR+4WM3BB448UY2s3iGvYRI7YUvqjOxNFuFtfnt2vbqUhGMlJNYxGBE+YyWhfCE7+Jod2MwMX7GKX5Wm4qTrsZlVO2MkK1KXjh+4zOwVGIULv7M4zOefDCUzG0m1GJ8hbMvVpuCt1uRir8LRjlHt9mRA78ADEon5VhRHrAA8uiazfjEdktmGmwr6KekXi4A+IS1S2YXbBvcFTtZozKpjcr9yjMwxG1m/Hq+z4jMEl5RyHmt0cWFz8AW2BdPxbdvmFIQNltaeUeeXswqYQnvBiOgY3VclOeHmiHmMRwDGw9bDuXxfXBQCQoNemwtp3yMYtFtelkxCiGY2DXKO0LLDOrHHGK4RjYalj2RRbR+xegFEw4xOJpqoJht8ffboYX6zGwETBsO4ul+Y4yxC6GY2ArYVeXeNrN+I1tUu7RtpvjbzfDi/kY2DCY9VsWRXpyCvGL6RbMY7CqJhNfuxm/6w4q92jV9fG3m+HFfgtmIIx6nuEdmoD4xXoL5iHlHSHazURd3aBtp1x+kHy7GV4Mt2D6wqRfMaTGG1DyOixlWLOVd8TabmZL9BZMLSy6NHy76YTwt2B6waDlDKNhJJzRfjFDuVPLTcHbTXsfgD2wZ0hc7aaBD0A3mLOUBdt/JZzTfj4LN0XLTUfsOgNOCX8M7Hew5kIWanF7OCbrGJhiv/kh5tdcdcIcFmg8bEnVhphfc034Y2AbYMt5LMi8E+CerGNgyj3uDTG/5rR292ZYgFHKO+JvN0vnGNgaWNKDecvc3w6uCn8MLF0FQ6aFaDfdVz4zw3xdDkNedq7dTPoY2FMe5x2ZmeWw5XMbPN52mhSy3TSgbFoz8/JtmLHFzXYz0Vswy/xcbmqeWgYDQt+Cqa+AEWPDt5smpKakGdxFMGK9w+1mcrdglni33HR4Ugq2fWaNd7nHNeHbTUNuOcyA+sOE1eHbTUt6vcNg5sKCqiYGcegmHEMfgFpYMCJ8u2nN+EMMojcMWGmi3UziGNhdnuQdjWPgmY7PerLtNIxteq0H/HNDI9v0RTjvMXsJT2zHwG63n3c0XAOjwh8D2w7XDQo/v2bXqIPWc49FbNXSDrAr/DGwm80uN8U/v+bgMbDfwm1fa2N+TX54gLllauC02cxtUXtIG8fArofTattsN6XDz5jT83BZryDtplx6wGbucStz+CnkKKftYA5XwGFL2KIPh0COtdDizz4rgrabMuwjeween2ALZkFacNo2c3/+hcxSNwjSsrnMNhUOu4nHW/eXkFyGfsjjjTR102UipBWd1vM4fwOXvcuj/cc5kNb9xNRPvpfziP+8HG2Szk/zKN+F2x7kx35/OSSQgS/xE0vhul6P/w//d8cjvSGBnT9/K0l+OA4R+z+8IwCAN2FjHQAAAABJRU5ErkJggg==';
  }
  getGrayStar(){
    return 'data:image/png;base64,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';
  }
  getCompanyLogo(){
    return 'data:image/png;base64,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';
  }
  _pickImage = async () => {
    ImagePicker.showImagePicker(options, response => {
      if (!response.didCancel && !response.error) {
        const source = { uri: response.uri }
        var savedThis = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", response.uri , true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {

          var reader = new FileReader();
          reader.onload = function(event) {
          var res = event.target.result;
          if(savedThis.state.imageSelect==1){
            savedThis.setState({bgImageSrc:res})
          }else if(savedThis.state.imageSelect==2){
            savedThis.setState({profileImage:res})
          }
        }
        var file = this.response;
        reader.readAsDataURL(file)
        };
        xhr.send()
      }else{
        console.log(response.error);
      }
    })
  }

  handleCanvas = async (canvas) => {
    this.setState({loading:false})
    const foodName = this.state.foodName;
    const resturantAddress = this.state.resturantAddress;
    const userReview = this.state.userReview;
    // var date = Moment(new Date()).format('MMMM Do YYYY');
    const date = '7 Jan 2018'
    const yellowStar = this.getYellowStar();
    const grayStar = this.getGrayStar();
    const profileImage = this.state.profileImage;
    const companyLogo = this.getCompanyLogo();
    const givenRatings = this.state.givenRatings;
    const bgImageSrc = this.state.bgImageSrc;
    let imageLoadingPromises = [];

    /**
     * objects have been added on canvas with dimensions 300x300
     * scale to get desired dimensions
     */
    window.devicePixelRatio = 1;
    const scaleX = 1.2;
    const scaleY = 1.2;
    canvas.width = 300 * scaleX;
    canvas.height = 300 * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleX, scaleY);
    console.log(window.devicePixelRatio, ctx.height);
    await this.addBackgroundImage(bgImageSrc, canvas);

    this.addOpaqueBg(0, 0, 200, 40, ctx);

    this.addText(ctx, {
      font: 'bold 10px Roboto',
      fill: 'white',
      text: foodName,
      x: 15, y: 20,
    });

    this.addText(ctx, {
      font: '9px Roboto',
      fill: 'white',
      text: resturantAddress,
      x: 15, y: 30,
    });

    this.addOpaqueBg(0, 225, 200, 75, ctx);
    imageLoadingPromises = this.addRatings(givenRatings, yellowStar, grayStar, canvas).concat(imageLoadingPromises)
    this.addText(ctx, {
      font: '8px Roboto',
      fill: 'white',
      text: date,
      x: 130, y: 238,
    });

    imageLoadingPromises.push(this.loadImage({
      src: profileImage, x: 10, y: 230,
      width: 20, height: 20,
      canvas: canvas
    }));

    this.addReviews(userReview, ctx);

    ctx.fillStyle = 'black';
    ctx.fillRect(140, 280, 60, 20);
    this.addText(ctx, {
      font: 'bold 7px Gotham Rounded',
      fill: 'white',
      text: 'PLUGD.APP',
      x: 160, y: 293,
    });
    imageLoadingPromises.push(this.loadImage({
      src: companyLogo, x: 145, y: 285,
      width: 10, height: 10,
      canvas: canvas
    }));
    await Promise.all(imageLoadingPromises);
    const base64Image = await canvas.toDataURL();
    // console.log(base64Image);
  }
  ratingCompleted(rating) {
  console.log("Rating is: " + rating)
   this.setState({givenRatings:rating})
  }


  loadImage = async function(options) {
    return new Promise((resolve, reject) => {
      const ctx = options.canvas.getContext('2d');
      ctx.fillStyle = 'transparrent';
      const image = new CanvasImage(options.canvas);
      image.crossOrigin = "Anonymous";
      image.src = options.src;
      image.addEventListener('load', () => {
        image.crossOrigin = 'anonymous';
        ctx.drawImage(image, options.x, options.y, options.width, options.height);
        resolve();
      });
    });
  }

  addText = function(ctx, options) {
    ctx.font = options.font;
    ctx.fillStyle = options.fill;
    ctx.fillText(options.text, options.x, options.y);
  }

  render() {
    return (
      <View style={styles.container}>
      {
        this.state.showImage?

        <Canvas ref={this.handleCanvas}/>
       :
       <View style={styles.contents}>
       <TextInput
       placeholder={"Food Name"}
       value={this.state.foodName}
       onChangeText={(text) =>this.setState({foodName:text})}
       underlineColorAndroid="#000000"
       />
       <TextInput
       placeholder={"Resturant Address"}
       value={this.state.resturantAddress}
       onChangeText={(text) =>this.setState({resturantAddress:text})}
       underlineColorAndroid="#000000"
       />
       <TextInput
       placeholder={"User Review"}
       value={this.state.userReview}
       onChangeText={(text) =>this.setState({userReview:text})}
       underlineColorAndroid="#000000"
       />
       <Rating
       type="star"
       ratingCount={5}
       fractions={0}
       startingValue={0}
       imageSize={30}
       onFinishRating={this.ratingCompleted}
       showRating
       style={{ paddingVertical: 20 }}
       />
       <TouchableOpacity onPress={()=>{
         this._pickImage()
         this.setState({imageSelect:1})
       }}
       style={styles.button}>
         {
           this.state.bgImageSrc!=""?
           <Text> Image Uploaded </Text>
           :
           <Text style={styles.buttonText}>Add background Img Source</Text>
         }
       </TouchableOpacity>

       <TouchableOpacity onPress={()=>{
         this._pickImage()
         this.setState({imageSelect:2})
       }}
       style={styles.button}>
           {
             this.state.profileImage!=""?
             <Text> Image Uploaded </Text>
             :
           <Text style={styles.buttonText}>Add Profile Img Source</Text>
           }
       </TouchableOpacity>


       <TouchableOpacity onPress={()=>this.setState({showImage:true})} style={styles.button}>
           <Text style={styles.buttonText}>Submit</Text>
       </TouchableOpacity>

       </View>
      }
      </View>
    )
  }
}
window.devicePixelRatio = 1;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 5,
    marginBottom: 10,
    color: '#000000',
    fontSize: 16,
  },
});
