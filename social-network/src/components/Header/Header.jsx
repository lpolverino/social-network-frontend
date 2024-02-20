import PropTypes from 'prop-types'; 

const Header = ({ setRenderingIndex, contents}) => {
  
    return (
    <div>
        {contents.map( (content,index) => <div key={content.content} onClick={() => setRenderingIndex(index)} > {content.content} </div>)}
    </div>
  )
}

Header.propTypes = {
    setRenderingIndex: PropTypes.func,
    contents: PropTypes.arrayOf(
        PropTypes.shape({
            content:PropTypes.string.isRequired,
            alert: PropTypes.bool
        })
    )
}

export default Header