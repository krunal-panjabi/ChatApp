using System.Text;

namespace AKchat.common
{
    public static class CommonMethods
    {

        public static string key = "akckjk@kyu@";
        public static string ConvertToEncrypt(string password)
        {
            if (string.IsNullOrEmpty(password)) return "";
            password += key;
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            return Convert.ToBase64String(passwordBytes);
        }

        public static string ConvertToDecrypt(string base64encodeData)
        {
            if (string.IsNullOrEmpty(base64encodeData)) return "";
           var base64EncodeBytes = Convert.FromBase64String(base64encodeData);
            var result = Encoding.UTF8.GetString(base64EncodeBytes);
            result = result.Substring(0,result.Length - key.Length);
            return result;
        }

    }
}
