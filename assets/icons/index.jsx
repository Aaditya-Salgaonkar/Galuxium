import { View, Text } from 'react-native'
import React from 'react'
import Home from './Home';
import Mail from './Mail';
import Lock from './Lock';
import User from './User';
import Heart from './Heart';
import Plus from './Plus';
import Search from './Search';
import Location from './Location';
import Call from './Call';
import Edit from './Edit';
import ArrowLeft from './ArrowLeft';
import ThreeDotsCircle from './Threedotscircle';
import ThreeDotsHorizontal from './Threedotshorizontal';
import Comment from './Comment';
import Share from './Share';
import Send from './Send';
import Delete from './Delete';
import Logout from './Logout';
import Image from './Image';
import Video from './Video';
import Camera from './Camera';
import Notification from './Notification';
import Chat from './Chat';
import Bio from './Bio'

const icons = {
  home:Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,
  notification:Notification,
  chat:Chat,
  bio:Bio
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
  return (
    <View>
      <IconComponent 
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      className='text-primary-50'
      {...props}
      />
    </View>
  )
}

export default Icon