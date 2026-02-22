// server useActionState perchè è un form
import { useActionState } from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        // prendo le credenziali dal form
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        // se le credenziali sono vuote, ritorno un errore; se va bene, chiamo la funzione handleLogin passata come props
        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }
    }

    return (
        <>
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
            <Row>
                <Col md={6}>
                    <Form action={formAction}>
                        <Form.Group controlId='username' className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' name='username' required />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' required minLength={6} />
                        </Form.Group>

                        {/* eventuale messaggio di errore nell'inserimento delle credenziali (es. password troppo corta) */}
                        {state.error && <p className="text-danger">{state.error}</p>}

                        <Button type='submit' disabled={isPending}>Login</Button>
                        <Link className='btn btn-danger mx-2 my-2' to={'/'} disabled={isPending}>Cancel</Link>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

// componente per il bottone di logout
function LogoutButton(props) {
  return <Button variant='outline-light' onClick={props.logout}>Logout</Button>;
}

export { LoginForm, LogoutButton };