<?php
require 'php/conexao.php';

try {
    $stmt = $pdo->query('SELECT id, nome, data FROM lembretes');

    echo '<h2>Lembretes:</h2>';
    echo '<ul>';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo '<li>';
        echo 'ID: ' . $row['id'] . ', Nome: ' . $row['nome'] . ', Data: ' . $row['data'];
        echo '</li>';
    }
    echo '</ul>';
} catch (PDOException $e) {
    echo 'Erro ao listar lembretes: ' . $e->getMessage();
}
?>