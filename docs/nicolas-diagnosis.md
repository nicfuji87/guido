# 🔍 Diagnóstico: Nicolas Fujimoto - Por que "Pagamento Atrasado"?

## 📊 **Dados Reais do Nicolas no Banco:**

```sql
-- Resultado da consulta:
usuario_nome: "Nicolas Fujimoto"
email: "fujimoto.nicolas@gmail.com"
cpfCnpj: "00484887122"                    -- CPF na tabela usuarios
id_assinatura_asaas: "sub_3jddkpjc9gsvylqh"  -- ❗ TEM VALOR
assinatura_status: "PAGAMENTO_PENDENTE"
conta_documento: "12.345.678/0001-90"     -- CNPJ na tabela contas  
tipo_conta: "IMOBILIARIA"
```

---

## ❓ **Por que ele vê "Pagamento Atrasado"?**

### ✅ **A lógica está CORRETA!**

**Nossa regra:**
- `id_assinatura_asaas = null` → Banner azul "Ativar Assinatura"
- `id_assinatura_asaas ≠ null` → Banner vermelho "Regularizar Pagamento"

**Nicolas tem:**
- `id_assinatura_asaas = "sub_3jddkpjc9gsvylqh"` (≠ null)
- **Portanto: Banner VERMELHO "Pagamento Atrasado" está CORRETO!**

---

## 🚨 **Problema Real: Inconsistência de Dados**

### **❌ Conflito de CPF vs CNPJ:**

```
Tabela usuarios:  cpfCnpj = "00484887122"        (CPF - 11 dígitos)
Tabela contas:    documento = "12.345.678/0001-90" (CNPJ - 14 dígitos)
```

### **❌ Por que isso causa erro no Asaas:**
1. **Sistema envia**: `cpfCnpj: "00484887122"` (CPF da tabela usuarios)
2. **Mas conta é**: IMOBILIARIA (deveria ter CNPJ)
3. **Asaas rejeita**: CPF para pessoa jurídica é inválido
4. **Erro retornado**: "O CPF/CNPJ informado é inválido"

---

## 🔧 **Soluções:**

### **Opção 1: Corrigir dados do Nicolas**
```sql
-- Atualizar cpfCnpj na tabela usuarios para CNPJ
UPDATE usuarios 
SET "cpfCnpj" = '12345678000190'  -- CNPJ sem formatação
WHERE email = 'fujimoto.nicolas@gmail.com';
```

### **Opção 2: Lógica inteligente no webhook**
```typescript
// No prepareWebhookData, usar documento da conta se for IMOBILIARIA:
const documentoFinal = data.conta.tipo_conta === 'IMOBILIARIA' 
  ? data.conta.documento.replace(/\D/g, '')  // CNPJ da conta
  : data.cpfCnpj;                            // CPF do usuario
```

### **Opção 3: Validação preventiva**
```typescript
// Validar antes de enviar webhook:
if (conta.tipo_conta === 'IMOBILIARIA' && userData.cpfCnpj.length !== 14) {
  throw new Error('Conta de imobiliária deve ter CNPJ válido');
}
```

---

## 🎯 **Recomendação:**

### **1. Implementar Opção 2 (Mais Robusta):**
```typescript
// Em prepareWebhookData:
documento: input.conta.tipo_conta === 'IMOBILIARIA' 
  ? input.conta.documento.replace(/\D/g, '')  // Usar CNPJ da conta
  : input.documento,                          // Usar CPF do input
```

### **2. Manter lógica do banner como está:**
- Nicolas tem `id_assinatura_asaas` → Banner "Regularizar Pagamento" está CORRETO
- A mensagem está certa, o problema é a inconsistência de dados

### **3. Corrigir dados do Nicolas:**
- Atualizar `cpfCnpj` na tabela usuarios para o CNPJ correto
- Ou usar documento da conta quando for IMOBILIARIA

---

## 🎉 **Resumo:**

### **✅ Banner está CORRETO para Nicolas:**
- Ele TEM `id_assinatura_asaas` = tem assinatura no Asaas
- Status "PAGAMENTO_PENDENTE" = precisa regularizar
- **Mensagem "Pagamento Atrasado" está CORRETA!**

### **❌ Problema real é inconsistência de dados:**
- CPF na tabela usuarios vs CNPJ na tabela contas
- Asaas rejeita CPF para conta IMOBILIARIA
- **Precisamos usar o documento correto baseado no tipo de conta**

---

## 🔧 **Próximos Passos:**
1. ✅ Toast implementado para feedback de loading
2. ✅ Tratamento de erro melhorado  
3. ⏳ Implementar lógica inteligente de documento
4. ⏳ Corrigir dados inconsistentes do Nicolas
