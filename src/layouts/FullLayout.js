import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';
import axios from 'axios';
import Cookies from 'js-cookies';
import { useEffect, useState } from 'react';

const FullLayout = () => {
  const customizerToggle = useSelector((state) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);
  const isFixedSidebar = useSelector((state) => state.customizer.isSidebarFixed);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const location = useLocation();
  const getTitle = location.pathname.split('/')[2];

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user`, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      navigate('/auth1/login');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''}`}
      >
        {/******** Sidebar **********/}

        <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
          <Sidebar user={user} />
        </aside>
        {/********Content Area**********/}

        <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''}`}>
          {/********header**********/}
          <Header user={user} />
          {/********Middle Content**********/}
          <div className={isFixedSidebar && LayoutHorizontal ? 'HsidebarFixed' : ''}>
            <div className="bg-white p-3 text-capitalize">
              <Container fluid className="boxContainer">
                <h5 className="fw-medium mb-0">{getTitle}</h5>
              </Container>
            </div>
          </div>

          <Container fluid className="p-4 boxContainer">
            <div>
              <Outlet />
            </div>
            {/* <Customizer className={customizerToggle ? 'showCustomizer' : ''} /> */}
            {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ''}
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
