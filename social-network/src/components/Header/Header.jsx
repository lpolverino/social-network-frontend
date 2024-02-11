import PropTypes from 'prop-types'; 

const Header = ({ setRenderingIndex, contents}) => {
  
    return (
    <div>
        {contents.map( (content,index) => <div key={content} onClick={() => setRenderingIndex(index)} > {content} </div>)}
    </div>
  )
}

Header.propTypes = {
    setRenderingIndex: PropTypes.func,
    contents: PropTypes.arrayOf(
        PropTypes.string
    )
}

export default Header