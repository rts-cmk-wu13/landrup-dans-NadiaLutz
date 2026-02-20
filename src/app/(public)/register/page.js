import styles from './register.module.scss';


export default function CreateUserPage() {
    return (
        <section className={styles.registerPage}>
            <article className={styles.introBrand}>
                <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
                <img className={styles.brandName} src="/imgs/brandname.png" alt="Brand Name"/>
                <div className={styles.heroDivider}></div>
            </article>
            <article className={styles.registerFormContainer}>
                <h1 className={styles.registerTitle}>Opret bruger</h1>
                <form className={styles.registerForm}>
                    <input type="text" placeholder='Fornavn' id="firstname" name="firstname" required />
                    <input type="text" placeholder='Efternavn'id="lastname" name="lastname" required />
                    <input type="text" placeholder='Brugernavn'id="username" name="username" required />
                    <input type="number" placeholder='Alder' id="age" name="age" required />
                    <input type="password" placeholder='Adgangskode' id="password" name="password" required />
                    <input type="password" placeholder='Gentag adgangskode' id="confirmPassword" name="confirmPassword" required />
                    <button type="submit">Log ind</button>
                </form> 
         </article> 
        </section>
    )
}