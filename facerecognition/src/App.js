import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Particles from "react-tsparticles"; 
import Signin from './components/signin/signin';
import Register from './components/register/Register';
import './App.css';






const particlesOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
}

const initialState = {
  input:'',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}

class App extends Component{
  
  constructor(){
    super();

    this.state = initialState;   
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // Not needed, it was used just to check conection to server

  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(data => console.log(data)) // .then(console.log) -> this is a shorthand version
  // }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regios[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

displayFaceBox = (box) => {
  this.setState({box:box});
}

  onInputChange = (event) =>{
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  //Try to fix this
  onButtonSummit = () =>{
    console.log('click');
    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/imageurl',{
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
          })
          .then(response => response.json())
          .then(response => {
            if(response){
              fetch('http://localhost:3000/image',{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: this.state.id
                })
              })
              .then(response => response.json())
              .then(count => {
                //Not using the commented part since it will change the user state to what ii is provided, instead we only need to change the entrees.
                // this.setState({user:{
                //   entries:count
                // }}) 

                Object.assign(this.state.user, {entries: count});
              })
            }
            this.displayFaceBox(this.calculateFaceLocation(response));
          })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'sigout') {
      this.setState(initialState);
    }else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {    
    return (
      <div className="App">
        <Particles className='particles' id="tsparticles" options={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange}  isSignedIn={this.state.isSignedIn}/>
        {
          this.state.route === 'home'?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange = {this.onInputChange} 
              onSummit = {this.onSummit}
            />        
            <FaceRecognition box={this.state.box} imageUrl = {this.state.imageUrl}/>
          </div>
          :
          (
            this.state.route === 'signin'?
            <Signin onRouteChange = {this.onRouteChange}/> 
            :
            <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> 
          )
          
           
            
        }
      </div>
    );
  }
}

export default App;
