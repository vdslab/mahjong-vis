export const Footer = () => {
    return <footer style={styles.footer}>
        <p className="copylight">&copy; Uramaru Nakaniwa Koizumi Tsukada Tago</p>
        <p className="hai">※ 画像は「<a href="https://mj-dragon.com/rule/">麻雀の雀龍.com</a>」の無料麻雀牌画を利用しています。</p>
    </footer>
};

const styles = {
    footer: {
        width: "87%",
        padding: '80px',
        background: "#ddd",
        textAlign: "center",
        position: "absolute",
        bottom: 0,
    }
}