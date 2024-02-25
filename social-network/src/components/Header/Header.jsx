import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom';

const Header = ({contents}) => {
  
    return (
    <div>
        <nav>
        {contents.map((content) => <li key={content.name}><Link to={"/"+content.link}>{content.name}</Link></li>)}
        </nav>
    </div>
  )
}

Header.propTypes = {
    contents: PropTypes.arrayOf(
        PropTypes.shape({
            name:PropTypes.string.isRequired,
            link:PropTypes.string.isRequired,
            alert: PropTypes.bool
        })
    )
}

export default Header