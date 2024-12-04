// import React from 'react';
// import { FaUser, FaDog } from 'react-icons/fa';
// import { Box, Icon } from '@chakra-ui/react';

// interface IconComboProps {
//   size?: number;
//   color?: string;
// }

// const IconCombo: React.FC<IconComboProps> = ({ size = 24, color = 'black' }) => {
//   return (
//     <Box position="relative" display="inline-block">
//       <Icon as={FaDog} boxSize={size} color={color} position="absolute" top={0} left={0} />
//       <Icon as={FaUser} boxSize={size * 0.7} color={color} position="absolute" top={-1} left={2} />
//     </Box>
//   );
// };

//export default IconCombo;


import { Image, Flex } from '@chakra-ui/react';

interface IconComboProps {
  size?: string;
  color?: string;
}

const IconCombo: React.FC<IconComboProps> = ({ size = "15px", color = "#000" }) => {
  return (
    <Flex mr={0}>
      <Image
        src="/images/animalColor.png" // Certifique-se de que o caminho da imagem está correto
        alt="Descrição da imagem"
        boxSize={size} // Ajuste o tamanho conforme necessário
        color={color} // Embora a propriedade color não afete imagens, você pode usá-la para outros elementos
      />
    </Flex>
  );
};

export default IconCombo;