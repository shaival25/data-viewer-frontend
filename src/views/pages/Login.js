import React from 'react';
import { Button, Label, FormGroup, Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import Cookies from 'js-cookies';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import { useDispatch } from 'react-redux';
import { login } from '../../store/apps/auth/AuthSlice';
import { ReactComponent as Logo } from '../../assets/images/logos/OPaqueLogo.svg';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values) => {
    const apiData = {
      email: values.email,
      password: values.password,
    };
    const response = await axios.post('http://localhost:5000/user/login', apiData);
    if (response.status === 200) {
      dispatch(login(response.data.user));
      Cookies.setItem('authToken', response.data.token, { expires: 1 });
      navigate('/');
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <Logo width={200} />
            <h2>Data Viewer</h2>
            <Card>
              <CardBody className="p-4 m-1">
                <h5 className="mb-4">Login</h5>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(fields) => handleLogin(fields)}
                  render={({ errors, touched }) => (
                    <Form>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          className={`form-control${
                            errors.email && touched.email ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control${
                            errors.password && touched.password ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Button type="submit" color="primary">
                          Login
                        </Button>
                      </FormGroup>
                    </Form>
                  )}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
