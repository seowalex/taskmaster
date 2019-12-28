import * as React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';

const Home: React.FunctionComponent = () => (
  <>
    <Helmet>
      <title>Todo Manager</title>
    </Helmet>
    <Navbar />
    <div className="container">
      <h1>Home</h1>
      <img src="https://api.adorable.io/avatars/300/alex@adorable.io.png" alt="Profile" className="profileImg rounded-circle" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam imperdiet maximus dui a venenatis. Aliquam eget risus convallis, vulputate neque et, sagittis velit. Donec iaculis risus ut metus hendrerit, in ornare magna congue. Phasellus viverra pellentesque quam et ornare. Nulla facilisi. Aliquam non placerat risus. Duis sagittis urna id pulvinar venenatis. Sed erat velit, tempor in fringilla sit amet, accumsan ac leo. Duis vitae vulputate erat. Donec sed vulputate tellus. Donec quis magna leo. Mauris eget iaculis eros. Curabitur mi ligula, sodales vitae vestibulum sit amet, bibendum eget enim. Curabitur mollis facilisis tincidunt. Nulla facilisi. Aenean quis augue eget eros posuere aliquet.</p>
      <p>Sed venenatis erat risus, ac laoreet turpis venenatis in. Nunc quis dolor quis orci euismod porta. Morbi massa orci, posuere quis mi nec, vehicula ultrices nunc. Pellentesque lacinia odio quis imperdiet tempus. Duis velit ipsum, hendrerit sed mauris vitae, fringilla finibus dui. Donec lacus quam, mollis elementum enim id, tristique imperdiet tellus. Duis eleifend risus risus, eu ornare urna varius non. Morbi vel arcu diam. Integer ut convallis tellus. Cras venenatis neque nec faucibus scelerisque. Proin ac tempus nunc. Praesent ut ipsum auctor lorem tristique tempus. Phasellus sed eros velit. Mauris est nulla, interdum id libero at, imperdiet dapibus arcu.</p>
      <p>Vestibulum eleifend enim tortor, in placerat libero tincidunt vitae. Ut lacinia placerat magna. Cras sit amet pellentesque massa. Aliquam egestas mauris nulla, eget sollicitudin justo fringilla quis. Cras vehicula tempor sapien ut pretium. Nam eget fermentum urna. Phasellus sit amet felis massa. Phasellus id lobortis velit. Integer suscipit ante eu eros posuere vehicula. Sed viverra diam quis libero sodales faucibus.</p>
      <p>Maecenas eu posuere metus. Vivamus id urna vitae quam suscipit vehicula. Suspendisse potenti. Nullam nunc nisl, sagittis sed fringilla in, eleifend eu elit. Suspendisse et quam pharetra sem blandit gravida sit amet in nibh. Ut luctus purus mauris. Suspendisse in feugiat lacus, in gravida odio. Aenean egestas justo eu metus ullamcorper elementum a vitae odio. Phasellus venenatis diam vitae arcu porttitor, et iaculis elit ultricies. Aenean venenatis hendrerit lorem, ut venenatis metus laoreet ut. Nullam accumsan risus sit amet porta eleifend. Sed placerat, nunc in euismod semper, ante nisi pulvinar odio, a volutpat lorem magna et diam. Nullam pretium egestas leo, quis elementum justo venenatis at. Donec imperdiet aliquam nulla, ac aliquam lacus faucibus vel.</p>
      <p>Fusce lacinia fringilla sollicitudin. Etiam sapien sapien, maximus non condimentum quis, vestibulum eget diam. Aliquam blandit, arcu non vulputate sodales, velit orci lobortis urna, at tincidunt odio justo vitae magna. Nam fringilla nulla massa, eu sollicitudin quam mollis dignissim. Duis vestibulum felis neque, at lobortis odio tincidunt in. Proin molestie tincidunt purus et laoreet. Integer faucibus rhoncus pellentesque. Cras eu sem nec tortor elementum rhoncus. Integer a pharetra tellus. Aliquam vel blandit libero. Phasellus dui lorem, facilisis eget velit eu, dapibus tincidunt ante. Phasellus efficitur convallis urna nec viverra. Aenean elementum tempor sollicitudin. Phasellus dictum varius purus sit amet pulvinar. Quisque eget turpis odio. Nam tristique pharetra est, et sodales mi vestibulum vel.</p>
    </div>
  </>
);

export default Home;
