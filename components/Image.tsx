
const Image = ( props ) => {  
    let { mode, src, height, width, style } = props;
    let modes = {
      'fill': 'cover',
      'fit': 'contain'
    };
    let size = modes[mode] || 'cover';

    let defaults = {
      height: height || 200,
      width: width || 300,
      backgroundColor: 'white'
    };

    let important = {
      backgroundImage: `url("${src}")`,
      backgroundSize: size,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    };

    return <div {...props} style={{...defaults, ...style, ...important}} />
}

export default Image;